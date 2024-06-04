import os
import sys
import markdown

if sys.version_info[0] >= 3:  
    unicode = str



def count_stars(filename):
    with open(filename, "r", encoding="UTF-8") as f: #decode file names
        lines = f.readlines()
        stars = 0
        for line in lines:
            stars += line.count("★") #count the number of ★ stars
        return stars
    
def organize_by_stars(dishes_folder):
    dishes = {}
    def process_folder(folder_path):
        for filename in os.listdir(folder_path):
            filepath = os.path.join(folder_path, filename)
            if os.path.isfile(filepath) and filename.endswith(".md"): 
                stars = count_stars(filepath)
                dishes[filename] = stars
            elif os.path.isdir(filepath):
                process_folder(filepath)

    process_folder(dishes_folder)
    
    

    for stars in sorted(dishes.values(), reverse=True):
        stars_file = os.path.join(dishes_folder, f"{stars}Star.md")
        with open(stars_file, "w", encoding="UTF-8") as f:
            f.write(f"# Dishes with {stars} Stars\n\n")
            for filename, star_count in dishes.items():
                if star_count == stars:
                    f.write(f"* [{filename}]({os.path.join(dishes_folder, filename)})\n")

dishes_folder = "dishes" #navigate to the main folder


organize_by_stars(dishes_folder)