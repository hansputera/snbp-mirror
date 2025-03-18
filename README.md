# SNBP Selfhosted Mirror

Selfhosted SNBP Mirror (just reverse proxy to https://pengumuman-snbp.snpmb.id) with little data modification.

## Features
- SNBP Registration Tracking, useful for school to tracking their students on SNBP

## Data Modification
1. We **modify** `authoritative` value from `https://pengumuman-snbp.snpmb.id/static` to `APP_URL/static` and redirect the request into `/api/snbp/[key]` self endpoint.
2. We **store** SNBP data from `/static/[key]` endpoint to our firebase application to help us tracking the students record.

## Authors
- Hanif Dwy Putra S <hanifdwyputrasembiring@gmail.com>

## License
MIT