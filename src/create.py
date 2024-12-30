import os

def create_file(path, content=""):
    """Create a file with the given content."""
    with open(path, "w") as file:
        file.write(content)

def create_folders_and_files(base_dir):
    """Set up the folder structure and initial files."""
    # Define the simplified structure
    structure = {
        "components": {
            "common": {
                "Header.js": "// Header component for the admin dashboard",
                "Sidebar.js": "// Sidebar navigation for the admin dashboard",
                "Filters.js": "// Filters for categories, subcategories, and products",
                "Modal.js": "// Reusable modal component",
            },
            "entities": {
                "Categories.js": "// Component for managing categories",
                "Subcategories.js": "// Component for managing subcategories",
                "Products.js": "// Component for managing products",
            }
        },
        "contexts": {
            "GlobalContext.js": "// Context for managing global state like authentication",
        },
        "hooks": {
            "useFetch.js": "// Custom hook for fetching data",
            "useEntityManagement.js": "// Hook for managing add/edit/delete operations for entities",
        },
        "pages": {
            "AdminDashboard.js": "// Main admin dashboard page",
            "LoginPage.js": "// Login page",
        },
        "services": {
            "api.js": "// API service functions",
            "auth.js": "// Authentication-related API calls",
        },
        "styles": {
            "AdminDashboard.css": "/* Admin Dashboard styles */",
            "common.css": "/* Common reusable styles */",
        },
    }

    # Function to recursively create folders and files
    def create_structure(base, structure):
        for name, content in structure.items():
            path = os.path.join(base, name)
            if isinstance(content, dict):
                # It's a folder
                os.makedirs(path, exist_ok=True)
                create_structure(path, content)
            else:
                # It's a file
                create_file(path, content)

    # Start creating the structure
    create_structure(base_dir, structure)

if __name__ == "__main__":
    base_directory = input("Enter the base directory for your React project: ")
    create_folders_and_files(base_directory)
    print(f"Folder structure and initial files have been created in {base_directory}.")
