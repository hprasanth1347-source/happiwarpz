from app.database.database import SessionLocal
from app.database.models import User
from app.utils.security import get_password_hash

def reset_user_passwords():
    db = SessionLocal()
    try:
        user_hash = get_password_hash('Happi1234!')
        admin_hash = get_password_hash('AdminHappi2026!')

        # Reset admin
        admin = db.query(User).filter(User.email == 'admin@happiwrapz.com').first()
        if admin:
            admin.passwordHash = admin_hash
            admin.accountStatus = 'ACTIVE'

        # Reset customer accounts
        customers = db.query(User).filter(User.role == 'CUSTOMER').all()
        for u in customers:
            u.passwordHash = user_hash
            u.accountStatus = 'ACTIVE'

        db.commit()
        print(f"Successfully updated passwords for {len(customers)} customer accounts and admin!")
    finally:
        db.close()

if __name__ == "__main__":
    reset_user_passwords()
