"""new User

Revision ID: cc0ad14efd55
Revises: 9382ebf6a156
Create Date: 2021-02-15 21:25:17.239240

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cc0ad14efd55'
down_revision = '9382ebf6a156'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('display_name',
                                     sa.String(length=30), nullable=True))
    op.add_column('users', sa.Column('profile_addr', sa.String(
        length=30), nullable=False, server_default='lorem ipsum'))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'profile_addr')
    op.drop_column('users', 'display_name')
    # ### end Alembic commands ###