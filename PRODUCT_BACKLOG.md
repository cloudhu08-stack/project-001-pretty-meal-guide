# Product backlog

These are non-blocking follow-ups. They do not authorize a Menu Ingestion Schema change.

## P1

- Da Vittorio Detail routing / loading bug: production data is retained, but its Homepage entry is temporarily hidden until the Homepage-to-Detail path is verified in the user-facing preview. This must not block the V1.0 launch of the remaining five restaurants.

- Present source-explicit service charges and surcharges more prominently beside a menu price. The current V1.3.1 records preserve them in source-backed uncertainty notes; no pricing total is calculated.
- Add a lightweight source-refresh workflow for menus whose official page is listed but whose readable item-and-price document was not captured (for example Yi Long Court à la carte).
- Add city expansion only after each new city has source-supported restaurant records; do not show placeholder restaurants.
- Add list filtering by menu type or information status without changing the ingestion contract.
- Add a real-time availability layer only after a stable, official reservation-source integration can return live bookable times. Until then, link users to the official reservation channel without displaying estimated availability.
- Interactive Dish Preview: keep as a non-blocking enhancement; only show a dish image when its relationship to the current restaurant and dish can be verified.

## Data follow-up

- Taian Table: locate and retain an official source that explicitly states its cuisine label before replacing the current “not confirmed from retained sources” display.
- Sushi Oyama: obtain an official current reservation or menu source before changing its operating status, target-date prices, or dish list.
- BOMBANA: obtain a current official food-menu source before replacing historical à-la-carte dishes or unpriced current menu listings.

## Post-launch Backlog

- Da Vittorio Detail routing / loading bug: retain its production data and keep the Homepage entry hidden until a user-facing Homepage-to-Detail test is stable.
- Honor Logo: introduce source-cleared official marks only when their usage and presentation are verified.
- Dish Hover: add contextual dish previews only for image-to-dish relationships that are verified.
- Mobile Dish Preview: design an accessible tap alternative to desktop dish hover.
- Real-time Availability: add only after a stable official reservation-source integration can return live bookable times.
- Experience Layer: assess non-menu experience information separately from menu ingestion.
- Spoiler system: allow diners to control how much menu detail is revealed.
- Visual polish: iterate on spacing, imagery, typography, and motion only after post-launch user feedback.
- Further Mobile polish: refine spacing and touch interactions after V1.0 public acceptance.
- Custom domain: attach a user-owned domain after V1.0 is available on the platform's HTTPS domain.
