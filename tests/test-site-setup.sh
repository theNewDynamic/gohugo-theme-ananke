#!/bin/bash

# Variables for configuration
HUGO_SITE_DIR="./my-new-site"
HUGO_SITE_NAME="My Test Site"
HUGO_CONTENT_NAME="my-first-post"
HUGO_THEME="ananke"
HUGO_CONFIG_FILE="$HUGO_SITE_DIR/config.toml"

# Help function
function usage() {
    echo "Usage: ./hugo_setup_test.sh [--help]"
    echo "Automated Hugo setup testing script. Ensure you are running on Ubuntu in a WSL2 environment."
    exit 0
}

# Check for --help option
if [[ "$1" == "--help" ]]; then
    usage
fi

# Function to check if Hugo is installed
function check_hugo_installed() {
    if ! command -v hugo &> /dev/null; then
        echo "Error: Hugo is not installed."
        exit 1
    fi
}

# Function to create a new Hugo site
function create_hugo_site() {
    if [ -d "$HUGO_SITE_DIR" ]; then
        echo "Error: Directory $HUGO_SITE_DIR already exists. Please remove it before running the test."
        exit 1
    fi
    hugo new site "$HUGO_SITE_DIR"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create Hugo site."
        exit 1
    fi
}

# Function to add a theme
function add_theme() {
    cd "$HUGO_SITE_DIR" || exit
    git init && git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/$HUGO_THEME
    if [ $? -ne 0 ]; then
        echo "Error: Failed to add the theme."
        exit 1
    fi
    echo 'theme = "ananke"' >> config.toml
}

# Function to create new content
function create_content() {
    hugo new posts/$HUGO_CONTENT_NAME.md
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create content."
        exit 1
    fi
}

# Function to verify configuration
function verify_configuration() {
    if grep -q 'theme = "ananke"' "$HUGO_CONFIG_FILE"; then
        echo "Success: Theme configuration found in $HUGO_CONFIG_FILE"
    else
        echo "Error: Theme configuration missing from $HUGO_CONFIG_FILE"
        exit 1
    fi
}

# Function to run the server
function run_hugo_server() {
    hugo server &>/dev/null &
    SERVER_PID=$!
    sleep 3  # Give the server some time to start
    if ps -p $SERVER_PID > /dev/null; then
        echo "Success: Hugo server started."
        kill $SERVER_PID
    else
        echo "Error: Failed to start the Hugo server."
        exit 1
    fi
}

# Main execution
check_hugo_installed
create_hugo_site
add_theme
create_content
verify_configuration
run_hugo_server

echo "All tests passed!"
exit 0
