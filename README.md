# FWGS-Alert

AWS Lambda handler for checking the Pennsylvania Fine Wine & Good Spirits
website to see if it is accepting online orders. Notifications will be published on provided
SNS Topic ARN. I created a CloudWatch event to trigger this function periodically during COVID-19 lockdown. 