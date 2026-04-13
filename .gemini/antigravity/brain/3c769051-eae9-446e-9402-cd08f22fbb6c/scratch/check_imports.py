import os
import re
from pathlib import Path

def check_imports():
    src_root = Path("/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src")
    broken_files = []

    for root, dirs, files in os.walk(src_root):
        for file in files:
            if file.endswith(('.js', '.jsx', '.css')):
                file_path = Path(root) / file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Simple regex for relative imports
                # matches: import ... from '../...' or @import '../...'
                matches = re.findall(r"(?:import|from|@import)\s+['\"](\.\./[^'\"]+)['\"]", content)
                
                for rel_path in matches:
                    # Resolve path
                    target_path = (file_path.parent / rel_path).resolve()
                    
                    # Check if target exists (as file or directory with index)
                    exists = target_path.exists() or \
                             (target_path.with_suffix('.js')).exists() or \
                             (target_path.with_suffix('.jsx')).exists() or \
                             (target_path.with_suffix('.css')).exists() or \
                             (target_path / 'index.js').exists() or \
                             (target_path / 'index.jsx').exists()
                    
                    if not exists:
                        broken_files.append((file_path, rel_path, target_path))

    return broken_files

if __name__ == "__main__":
    src_root = Path("/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src")
    broken = check_imports()
    if not broken:
        print("No broken relative imports found!")
    else:
        print(f"Found {len(broken)} broken imports:")
        for f, rel, target in broken:
            try:
                print(f"File: {f.relative_to(src_root.parent.parent)}\n  Import: {rel}\n  Resolved to (Missing): {target}\n")
            except:
                print(f"File: {f}\n  Import: {rel}\n  Resolved to (Missing): {target}\n")
