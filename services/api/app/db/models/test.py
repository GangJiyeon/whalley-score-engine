# app/db/models/test.py
import uuid
from datetime import datetime

from sqlalchemy import Integer, String, DateTime, func, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY

from app.db.base import Base

class Test(Base):
    __tablename__ = "tests"
    __table_args__ = (
        Index("ix_tests_device_id_created_at", "device_id", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)

    selected_region_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("regions.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    total_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    breakdown: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    summary_line: Mapped[str | None] = mapped_column(String(255), nullable=True)
    reasons: Mapped[list[str]] = mapped_column(ARRAY(String()), nullable=False, default=list)
    next_steps: Mapped[list[str]] = mapped_column(ARRAY(String()), nullable=False, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    selected_region = relationship("Region", back_populates="selected_by_tests", foreign_keys=[selected_region_id])
    answers = relationship("TestAnswer", back_populates="test", cascade="all, delete-orphan", passive_deletes=True,)
