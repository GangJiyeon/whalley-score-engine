from sqlalchemy.orm import Session
from app.db.models.region import Region

DEFAULT_REGIONS = [
    {
        "country_code": "JP",
        "country_name": "Japan",
        "region_name": "Tokyo",
        "city_type": "metro",
        "base_score": 0,
        "base_breakdown": {},
        "tags": ["tokyo", "japan", "metro"],
    },
    {
        "country_code": "AU",
        "country_name": "Australia",
        "region_name": "Sydney",
        "city_type": "metro",
        "base_score": 0,
        "base_breakdown": {},
        "tags": ["sydney", "australia", "metro"],
    },
]

def seed_regions(db: Session) -> None:
    for r in DEFAULT_REGIONS:
        exists = (
            db.query(Region)
            .filter_by(
                country_code=r["country_code"],
                region_name=r["region_name"],
            )
            .first()
        )
        if not exists:
            db.add(Region(**r))

def run_seed(db: Session) -> None:
    seed_regions(db)
    db.commit()
