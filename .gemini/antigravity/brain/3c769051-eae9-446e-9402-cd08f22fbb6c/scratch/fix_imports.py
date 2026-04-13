import os
import re
from pathlib import Path

def get_correct_rel_path(file_path, rel_path, src_root):
    # original rel_path like '../../lib/api'
    # we want to find where it's supposed to go in src/
    
    # Try different parent levels until we find one that works or hit src_root
    parts = rel_path.split('/')
    target_name = []
    for p in parts:
        if p != '..' and p != '.':
            target_name.append(p)
    
    target_subpath = "/".join(target_name)
    
    # The target is likely src/target_subpath or src/shared/target_subpath etc.
    # But usually, it's just src/ + target_subpath (like src/lib/api)
    potential_targets = [
        src_root / target_subpath,
        src_root / "shared" / target_subpath,
        src_root / "admin" / target_subpath,
        src_root / "public" / target_subpath
    ]
    
    for target in potential_targets:
        exists = target.exists() or \
                 (target.with_suffix('.js')).exists() or \
                 (target.with_suffix('.jsx')).exists() or \
                 (target.with_suffix('.css')).exists() or \
                 (target / 'index.js').exists() or \
                 (target / 'index.jsx').exists()
        
        if exists:
            # Found it! Calculate new relative path
            new_rel = os.path.relpath(target, file_path.parent)
            # relative_path might not have ../ if it's in the same dir, but usually it does
            if not new_rel.startswith('.'):
                new_rel = './' + new_rel
            return new_rel
            
    return None

def fix_imports():
    src_root = Path("/home/mam2z/apps/aakorea-main/frontend/aakorea-main/src")
    fixed_count = 0

    for root, dirs, files in os.walk(src_root):
        for file in files:
            if file.endswith(('.js', '.jsx', '.css')):
                file_path = Path(root) / file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                matches = re.findall(r"((?:import|from|@import)\s+['\"])(\.\./[^'\"]+)(['\"])", content)
                
                for prefix, rel_path, suffix in matches:
                    target_path = (file_path.parent / rel_path).resolve()
                    
                    exists = target_path.exists() or \
                             (target_path.with_suffix('.js')).exists() or \
                             (target_path.with_suffix('.jsx')).exists() or \
                             (target_path.with_suffix('.css')).exists() or \
                             (target_path / 'index.js').exists() or \
                             (target_path / 'index.jsx').exists()
                    
                    if not exists:
                        new_rel = get_correct_rel_path(file_path, rel_path, src_root)
                        if new_rel:
                            # Avoid double extensions if os.relpath added them
                            for ext in ['.js', '.jsx', '.css']:
                                if new_rel.endswith(ext):
                                    new_rel = new_rel[:-len(ext)]
                            
                            old_line = f"{prefix}{rel_path}{suffix}"
                            new_line = f"{prefix}{new_rel}{suffix}"
                            new_content = new_content.replace(old_line, new_line)
                            fixed_count += 1
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

    return fixed_count

if __name__ == "__main__":
    count = fix_imports()
    print(f"Fixed {count} imports.")
