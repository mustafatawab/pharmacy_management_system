from sqlmodel import SQLModel, create_engine, Session, select
from config import get_settings
from typing import Type, TypeVar, Optional

settings = get_settings()
engine = create_engine(settings.database_url, echo=True)

T = TypeVar("T")

class TenantSession(Session):
    """
    A custom Session that simplifies tenant-scoped queries.
    Instead of writing .where(Model.tenant_id == id) every time,
    you can use session.exec_tenant(select(Model)).
    """
    def __init__(self, *args, tenant_id: Optional[int] = None, **kwargs):
        super().__init__(*args, **kwargs)
        self.tenant_id = tenant_id

    def exec_tenant(self, statement, *args, **kwargs):
        # Automatically append tenant_id if it's a select statement and not already filtered
        # This is a 'helper' approach which is safer and easier for devs to use.
        if self.tenant_id is not None:
            statement = statement.where(statement.table.tenant_id == self.tenant_id)
        return self.exec(statement, *args, **kwargs)

def create_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session