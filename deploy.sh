#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

try_command() {
    if ! "$@"; then
        echo -e "\e[31mError: Command failed: $*\e[0m"
        exit 1
    fi
}


backend_tech="node"
dir_name="CRUD-Node"

#clear and run docker compose run
sudo rm -rf frontend
sh docker-clear.sh
docker compose up -d
while [ ! -f frontend/index.html ]; do 
    echo "Waiting for frontend/index.html to be created..."
    sleep 1; 
done

#Change the path to access assets in index.hmtl
sudo sed -i 's|="/|="/'$backend_tech'/|g' frontend/index.html

#Copy frontend files to temporary directory on the remote server
try_command scp -i ~/.ssh/id_ed25519 -r ./frontend/* karthikeya@crud-app.run.place:/tmp
echo -e "\e[32mCopied frontend files to /tmp\e[0m"

# Move frontend files to nginx html with sudo, replacing existing files if they exist
try_command ssh -i ~/.ssh/id_ed25519 karthikeya@crud-app.run.place "sudo rm -rf /var/www/html/'$backend_tech' && sudo mkdir -p /var/www/html/'$backend_tech' && sudo mv -f /tmp/* /var/www/html/'$backend_tech'"
echo -e "\e[32mMoved frontend files to nginx html, replacing existing files if they exist\e[0m"

# Copy backend files to project directory excluding the ones in deploy-ignore.txt
rsync -av --exclude-from='deploy-ignore.txt' -e "ssh -i ~/.ssh/id_ed25519" ./backend/ karthikeya@crud-app.run.place:$dir_name
echo -e "\e[32mCopied backend files to project directory, excluding files from deploy-ignore.txt\e[0m"

# #Copy backend files to project directory (this should work if your user has access)
# try_command scp -i ~/.ssh/id_ed25519 -r ./backend/* karthikeya@crud-app.run.place:$dir_name
# echo -e "\e[32mCopied backend files to project directory\e[0m"

#Copy nginx config to temporary directory
try_command scp -i ~/.ssh/id_ed25519 ./nginx.config karthikeya@crud-app.run.place:/tmp
echo -e "\e[32mCopied nginx config to /tmp\e[0m"

# Move nginx config to nginx directory with sudo, replacing existing file if it exists
try_command ssh -i ~/.ssh/id_ed25519 karthikeya@crud-app.run.place "sudo mv -f /tmp/nginx.config /etc/nginx/sites-available/default"
echo -e "\e[32mMoved nginx config to /etc/nginx/sites-available/default, replacing existing file if it exists\e[0m"

#Delete existing docker images, containers, volumes and networks
try_command ssh -i ~/.ssh/id_ed25519 karthikeya@crud-app.run.place "sh docker-clear.sh"
echo -e "\e[32mDocker Cleared\e[0m"

#Run Docker compose
try_command ssh -i ~/.ssh/id_ed25519 karthikeya@crud-app.run.place "cd '$dir_name' && docker compose -f docker-compose.prod.yml up -d"
echo -e "\e[32mDocker Images, Containers and Volumes created successfully\e[0m"

#Restart nginx
try_command ssh -i ~/.ssh/id_ed25519 karthikeya@crud-app.run.place "sudo systemctl restart nginx"
echo -e "\e[32mRestarted nginx\e[0m"

echo -e "\e[32mDeployment completed successfully\e[0m"