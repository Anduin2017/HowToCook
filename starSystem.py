import os
import sys
import markdown



if sys.version_info[0] >= 3:
    unicode = str

def count_stars(filename: str) -> int:
    with open(filename, "r", encoding="UTF-8") as f:
        lines = f.readlines()
        stars = 0
        for line in lines:
            stars += line.count("★")
        return stars

def organize_by_stars(dishes_folder: str) -> None:
    dishes = {}

    def process_folder(folder_path: str) -> None:
        for filename in os.listdir(folder_path):
            filepath = os.path.join(folder_path, filename)
            if os.path.isfile(filepath) and filename.endswith(".md"):
                stars = count_stars(filepath)
                dishes[filepath] = stars
            elif os.path.isdir(filepath):
                process_folder(filepath)

    # Get absolute path of the dishes folder
    base_path = os.path.abspath(dishes_folder)
    process_folder(base_path)

    for stars in sorted(set(dishes.values()), reverse=True):
        stars_file = os.path.join(base_path, f"{stars}Star.md")
        with open(stars_file, "w", encoding="UTF-8") as f:
            f.write(f"# Dishes with {stars} Stars\n\n")
            for filepath, star_count in dishes.items():
                if star_count == stars:
                    # Calculate the relative path from the base path
                    relative_path = os.path.relpath(filepath, start=base_path).replace("\\", "/")
                    # Correctly format the link for GitHub
                    f.write(f"* [{os.path.basename(filepath).replace('.md', '')}](./{relative_path})\n")

dishes_folder = "dishes"
organize_by_stars(dishes_folder)
