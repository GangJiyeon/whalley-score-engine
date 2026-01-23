# app/db/models/region.py
import uuid
from datetime import datetime

from sqlalchemy import String, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy import UniqueConstraint

from app.db.base import Base

class Region(Base):
    __tablename__ = "regions"
    __table_args__ = (
        UniqueConstraint("country_code", "region_name", name="uq_regions_country_region"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    country_code: Mapped[str] = mapped_column(String(2), nullable=False, index=True)   # JP, AU
    country_name: Mapped[str] = mapped_column(String(64), nullable=False)
    region_name: Mapped[str] = mapped_column(String(64), nullable=False)

    city_type: Mapped[str] = mapped_column(String(16), nullable=False, default="metro")  # metro/regional

    base_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    base_breakdown: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    tags: Mapped[list[str]] = mapped_column(ARRAY(String()), nullable=False, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    selected_by_tests = relationship("Test", back_populates="selected_region", foreign_keys="Test.selected_region_id")
