import uuid

from datetime import datetime
from sqlalchemy import String, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY

from app.db.base import Base

class TestAnswer(Base):
    __tablename__ = "test_answers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tests.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    question_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)

    text_answer: Mapped[str | None] = mapped_column(String, nullable=True)
    selected_options: Mapped[list[str]] = mapped_column(ARRAY(String()), nullable=False, default=list)
    extra: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    test = relationship("Test", back_populates="answers")