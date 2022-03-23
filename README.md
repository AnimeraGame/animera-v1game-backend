**Edit a file, create a new file, and clone from Github in under 2 minutes**

When you're done, you can delete the content in this README and update the file with details for others getting started with your repository.

*We recommend that you open this README in another tab as you perform the tasks below.*

---

## Edit a file

You’ll start by editing this README file to learn how to edit a file in Github.

1. Click **Source** on the left side.
2. Click the README.md link from the list of files.
3. Click the **Edit** button.
4. Delete the following text: *Delete this line to make a change to the README from Github.*
5. After making your change, click **Commit** and then **Commit** again in the dialog. The commit page will open and you’ll see the change you just made.
6. Go back to the **Source** page.

---

## Create a file

Next, you’ll add a new file to this repository.

1. Click the **New file** button at the top of the **Source** page.
2. Give the file a filename of **contributors.txt**.
3. Enter your name in the empty file space.
4. Click **Commit** and then **Commit** again in the dialog.
5. Go back to the **Source** page.

Before you move on, go ahead and explore the repository. You've already seen the **Source** page, but check out the **Commits**, **Branches**, and **Settings** pages.

---

## Clone a repository

Use these steps to clone from SourceTree, our client for using the repository command-line free. Cloning allows you to work on your files locally. If you don't yet have SourceTree, [download and install first](https://www.sourcetreeapp.com/). If you prefer to clone from the command line, see [Clone a repository](https://confluence.atlassian.com/x/4whODQ).

1. You’ll see the clone button under the **Source** heading. Click that button.
2. Now click **Check out in SourceTree**. You may need to create a SourceTree account or log in.
3. When you see the **Clone New** dialog in SourceTree, update the destination path and name if you’d like to and then click **Clone**.
4. Open the directory you just created to see your repository’s files.

Now that you're more familiar with your Github repository, go ahead and add a new file locally. You can [push your change back to Github with Github Desktop or SourceTree](https://confluence.atlassian.com/x/iqyBMg), or you can [add, commit,](https://confluence.atlassian.com/x/8QhODQ) and [push from the command line](https://confluence.atlassian.com/x/NQ0zDQ).


## Database configration
1. Edit the host, username and password in ./database.json and ./.env files.
2. Install db-migrate package
**npm install -g db-migrate**
3. Execute the migrations by using db-migrate command
**db-migrate up**

## Deployment
a.)  You need to install the LAMP server, node and pm2 for starting a new apex server.
1. Clone the repo:
**git clone repository_link**
2. Navigate to the clone project file.
3. Install NPM packages
**npm install**
4. Start the process with PM2.
**pm2 start server.js**

b.) If you want to just check the current development or production server you need to navigate the clone project path or just run **pm2 show process_id** to check the process and clone repository details. 


## Localization
MarsVerse supports these languages: Arabic, Bosnian, German, Greek, English, Spanish, Finnish, French, Hindi, Hungarian, Indonesian, Italian, Hebrew, Japanese, Korean, Dutch, Norwegian, Polish, Portuguese, Russian, Serbian, Swedish, Thai, Tagalog, Turkish, Ukranian, Vietnamese, Chinese.