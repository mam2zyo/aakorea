import os
import re
from pathlib import Path

# Target directory
ROOT = Path("/home/mam2z/apps/aakorea-main/backend/src/main/java/org/aakorea")

def cleanup():
    # 1. Content & Filename transformation rules
    # Order matters: longer strings first to avoid partial replacement issues
    transformations = [
        ("AdminUserAdminService", "UserOfficeService"),
        ("AdminUserManagementEventType", "UserManagementEventType"),
        ("AdminUserManagementEvent", "UserManagementEvent"),
        ("AdminUserPermissionGrant", "UserPermissionGrant"),
        ("AdminUserStatus", "UserStatus"),
        ("AdminUserRepository", "UserRepository"),
        ("AdminUserHistoryEventData", "UserHistoryEventData"),
        ("AdminUserData", "UserData"),
        ("AdminUser", "User"),
        ("AdminRole", "Role"),
        ("AdminPermission", "Permission"),
        # General prefix/suffix removal
        ("AdminService", "OfficeService"),
        ("AdminRepository", "Repository"),
        ("AdminController", "OfficeController"),
    ]

    # 2. Process all files
    for root, dirs, files in os.walk(ROOT):
        for file in files:
            if not file.endswith(".java"):
                continue
            
            file_path = Path(root) / file
            
            # Read content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            
            # Apply transformations to content
            for old, new in transformations:
                # Use word boundary for class/variable names
                new_content = re.sub(r'\b' + old + r'\b', new, new_content)
                # Also handle camelCase variables (adminUser -> user)
                camel_old = old[0].lower() + old[1:]
                camel_new = new[0].lower() + new[1:]
                if camel_old != old:
                    new_content = re.sub(r'\b' + camel_old + r'\b', camel_new, new_content)

            # Extra: Handle any remaining /api/admin or similar strings in annotations
            new_content = new_content.replace("/api/admin", "/api/office")

            # Write back if changed
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)

            # 3. Rename the file itself
            new_name = file
            for old, new in transformations:
                if old in new_name:
                    new_name = new_name.replace(old, new)
            
            if new_name != file:
                new_file_path = Path(root) / new_name
                if new_file_path.exists():
                    os.remove(new_file_path)
                file_path.rename(new_file_path)
                print(f"Renamed: {file} -> {new_name}")

if __name__ == "__main__":
    cleanup()
    print("Cleanup completed.")
