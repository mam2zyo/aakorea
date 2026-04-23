import os
import shutil
import re
from pathlib import Path

# Paths
BASE_DIR = Path("/home/mam2z/apps/aakorea-main")
OLD_SRC = BASE_DIR / "old/backend/aakorea-main/src/main/java/org/aakorea/main"
NEW_ROOT = BASE_DIR / "backend/src/main/java/org/aakorea"
NEW_AUTH = NEW_ROOT / "auth"
NEW_CORE = NEW_ROOT / "core"

def migrate():
    # 1. Clean start
    if NEW_ROOT.exists(): shutil.rmtree(NEW_ROOT)
    NEW_ROOT.mkdir(parents=True, exist_ok=True)
    NEW_AUTH.mkdir(parents=True, exist_ok=True)
    NEW_CORE.mkdir(parents=True, exist_ok=True)

    # 2. Copy and initial rename of folders
    for item in OLD_SRC.iterdir():
        if item.is_dir():
            if item.name == "auth":
                for sub in item.iterdir():
                    dest = NEW_AUTH / sub.name
                    if sub.is_dir():
                        shutil.copytree(sub, dest)
                    else:
                        shutil.copy2(sub, dest)
            else:
                target_name = "aaservice" if item.name == "generalservice" else item.name
                target_dir = NEW_CORE / target_name
                shutil.copytree(item, target_dir)
        elif item.is_file() and item.suffix == ".java":
            shutil.copy2(item, NEW_CORE / item.name)

    # 3. Rename 'admin' folders to 'office'
    for root, dirs, files in os.walk(NEW_ROOT, topdown=False):
        for d in dirs:
            if d == "admin":
                old_dir = Path(root) / d
                new_dir = Path(root) / "office"
                if new_dir.exists():
                    shutil.rmtree(new_dir)
                old_dir.rename(new_dir)

    # 4. Refactor content and filenames
    for root, dirs, files in os.walk(NEW_ROOT):
        for file in files:
            if not file.endswith(".java"):
                continue
            
            file_path = Path(root) / file
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = content
            
            # Package and Import updates
            new_content = new_content.replace("org.aakorea.main.auth", "org.aakorea.auth")
            new_content = new_content.replace("org.aakorea.main.generalservice", "org.aakorea.core.aaservice")
            new_content = new_content.replace("org.aakorea.main", "org.aakorea.core")
            
            # Import/Package 'admin' -> 'office'
            new_content = new_content.replace(".api.admin", ".api.office")
            
            # RequestMapping paths '/api/admin' -> '/api/office'
            new_content = new_content.replace('"/api/admin', '"/api/office')
            new_content = new_content.replace("'/api/admin", "'/api/office")
            
            # Rename AdminUser -> User
            new_content = re.sub(r'\bAdminUser\b', 'User', new_content)
            
            # Rename *AdminController -> *OfficeController
            new_content = re.sub(r'\b(\w*)AdminController\b', r'\1OfficeController', new_content)
            new_content = re.sub(r'\bAdmin(\w+)Controller\b', r'\1OfficeController', new_content)

            # Apply specific package change for the file itself
            rel_path = file_path.parent.relative_to(NEW_ROOT)
            pkg_parts = ["org", "aakorea"] + list(rel_path.parts)
            new_pkg = ".".join(pkg_parts)
            new_content = re.sub(r'^package\s+org\.aakorea\..+;', f'package {new_pkg};', new_content, flags=re.MULTILINE)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            # Filename renames
            new_file_name = file
            if file == "AdminUser.java":
                new_file_name = "User.java"
            elif file == "AakoreaMainApplication.java":
                new_file_name = "AakoreaCoreApplication.java"
            
            # Generalized Controller rename
            new_file_name = re.sub(r'^(\w*)AdminController\.java$', r'\1OfficeController.java', new_file_name)
            new_file_name = re.sub(r'^Admin(\w+)Controller\.java$', r'\1OfficeController.java', new_file_name)

            if new_file_name != file:
                new_file_path = file_path.parent / new_file_name
                if new_file_path.exists():
                    os.remove(new_file_path)
                file_path.rename(new_file_path)

    # Handle AakoreaCoreApplication class name rename
    app_file = NEW_CORE / "AakoreaCoreApplication.java"
    if app_file.exists():
        with open(app_file, 'r') as f:
            c = f.read()
        c = c.replace("public class AakoreaMainApplication", "public class AakoreaCoreApplication")
        with open(app_file, 'w') as f:
            f.write(c)

    # 5. Resources
    OLD_RES = BASE_DIR / "old/backend/aakorea-main/src/main/resources"
    NEW_RES = BASE_DIR / "backend/src/main/resources"
    if OLD_RES.exists():
        if NEW_RES.exists(): shutil.rmtree(NEW_RES)
        shutil.copytree(OLD_RES, NEW_RES)
        for root, dirs, files in os.walk(NEW_RES):
            for file in files:
                if file.endswith((".yml", ".yaml", ".properties")):
                    f_path = Path(root) / file
                    with open(f_path, 'r', encoding='utf-8') as f:
                        c = f.read()
                    c = c.replace("org.aakorea.main.auth", "org.aakorea.auth")
                    c = c.replace("org.aakorea.main.generalservice", "org.aakorea.core.aaservice")
                    c = c.replace("org.aakorea.main", "org.aakorea.core")
                    c = c.replace(".api.admin", ".api.office")
                    c = c.replace("/api/admin", "/api/office")
                    with open(f_path, 'w', encoding='utf-8') as f:
                        f.write(c)

if __name__ == "__main__":
    migrate()
    print("Migration completed successfully.")
