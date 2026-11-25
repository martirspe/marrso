# SES de MARRSO en producción

Terraform administra la identidad SES con Easy DKIM, MAIL FROM propio, el conjunto transaccional, eventos de entrega en SNS, alarmas de reputación y un usuario IAM de envío limitado. El estado se guarda en S3 con bloqueo nativo. No se generan claves de acceso en Terraform para evitar secretos en el estado.

Los tres CNAME DKIM, el MX y el TXT SPF de `bounce.marrso.com`, y el DMARC del dominio se publican en Cloudflare fuera de este módulo. Los cinco registros de SES se repusieron en la zona el 25 de noviembre de 2026 tras detectar que faltaban. Este módulo no modifica DNS para evitar dos estados propietarios de los mismos registros. Si cambian los tokens o se traslada la propiedad de DNS, actualizar la zona y su estado propietario antes de enviar correo.

## Antes de aplicar

1. Verificar en el estado propietario de DNS que siguen publicados los tres CNAME DKIM, MX y SPF de MAIL FROM, y el único registro DMARC del dominio (`p=reject` al momento del despliegue).
2. Usar el perfil AWS `ops` en la cuenta `496620607923`, con permisos de SES, IAM, SNS, CloudWatch y S3.
3. Usar el bucket S3 privado y versionado `marrso-tfstate-496620607923` para el estado. Rellenar `backend.hcl` desde el ejemplo. El bucket debe existir antes de `terraform init`.
4. Copiar `prod.tfvars.example` a `prod.tfvars` y completar el correo de alertas.

```powershell
cd infra/terraform
$env:AWS_PROFILE = "ops"
terraform init '-backend-config=backend.hcl'
terraform fmt -check
terraform validate
terraform plan '-var-file=prod.tfvars' '-out=prod.tfplan'
terraform apply prod.tfplan
```

Si ya existen recursos AWS con esos nombres, importarlos al estado antes de aplicar.

## Después de aplicar

Confirmar la suscripción recibida por `alerts_email`. Comprobar en SES que la identidad y MAIL FROM figuran como verificados y que la cuenta de la región tiene acceso de producción (`ProductionAccessEnabled=true`). Si sigue en sandbox, solicitar acceso de producción en SES; Terraform no lo habilita.

La clave IAM se creó fuera de Terraform y se guardó en el `.env` local de MARRSO, ignorado por Git. Copiar ese archivo al `.env` privado del VPS por un canal seguro y con permisos de lectura restringidos; no copiarlo al repositorio. Incluye `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` y `SES_CONFIGURATION_SET`. El servidor usa `SES_CONFIGURATION_SET` al enviar, por lo que los eventos llegan a SNS. Reiniciar el contenedor y probar una consulta real; comprobar recepción, Reply-To y métricas de SES.

La identidad, DKIM y MAIL FROM están verificados; la cuenta SES tiene acceso de producción. Se probó el envío con la clave IAM al simulador oficial de SES. La suscripción de alertas SNS debe confirmarse desde el mensaje enviado a `contacto@marrso.com`; mientras figure `PendingConfirmation`, no llegarán alertas por correo.

`CONTACT_TO_EMAIL` debe ser un buzón que reciba correo. Si la cuenta SES vuelve a sandbox, también debe estar verificado para la prueba. Las alarmas de reputación son por cuenta y región; revisar las existentes antes de crear otras en la misma cuenta.
