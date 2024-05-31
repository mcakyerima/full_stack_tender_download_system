# 📝 Tender Download System

![1](https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/33876ea8-6b6c-4bd8-a9e4-ecbcda5bab78)
<div style="display: flex; justify-content: space-around;">
  <img src="" alt="Tender Mobile Dark" width="300"/>
  <img src="" alt="Tender Mobile Light" width="300"/>
</div>

## 📖 Description
The Tender Download System is a full-stack React-based web application built with TypeScript and React, designed for browsing, sharing, and downloading tender documents. Users can create organizations, share tenders, view tender details, sort and filter, add to favorites, delete, and more features like Communicating with all documents using Generative AI coming soon.

## Features

✨ **Functionality:**
- Browse a list of available tenders
- View tender details including title, description, and submission deadline
- Download tender documents
- Advanced search functionality to filter tenders based on keywords
- User authentication and authorization with Clerk
- Users can create organizations, share tenders, add favorites, delete, and more
- Professional database setup and deployment using Convex
- Ability to Communicate with all tenders in realtime using Generative AI. `coming soon`.

🖥️ **User Interface:**
- Clean and user-friendly interface designed with React components
- Responsive design for different screen sizes (desktop, tablet, mobile)
- Error Handling with Zod and React Hook Forms
- Custom Modals and Hooks that work on any device

## 🛠️ Setup Instructions

Follow this Documentation to set up the project locally:

### 1. Clone the repository:

```bash
git clone https://github.com/mcakyerima/full_stack_tender_download_system.git
```

### 2. Navigate to the project directory and open it in your preferred code editor, preferably vscode:

```bash
cd full_stack_tender_download_system
```

### 3. Install dependencies:
   - In the vscode terminal, run this command to install dependencies and libraries

```bash
npm install
```

### 4. Set up Convex environment:
 After the dependencies installation is finished, open a second new terminal in vscode and run this command
  ```bash
  npx convex dev
  ```
This command will open the Convex `CLI` and ask you to select your Device name. After that, it will open the browser to verify your `CLI` and sign you up. Preferably, you should log in with GitHub. After running this command, Convex will run all the schemas, schema tests, and validations written in the Convex directory, and it will automatically create the database in your Convex dashboard in the cloud.

The `npx convex dev` command will also create a `.env.local` file in the root of your project containing your `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`

Example:
```
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=dev:clear-swordfish-343 # your convex deployment link

NEXT_PUBLIC_CONVEX_URL=https://clear-swordfish-343.convex.cloud
```

### 5. Set up Clerk for authentication and organization creation + OTP or email validation:
- Go to [Clerk](https://www.clerk.com) and sign up
- Create a new project and give it a name of your choice
- Choose a Login method of your choice, preferably email and Google.
  
  <img width="812" alt="create an app in clerk" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/0fc7156e-c780-48fa-89b7-02a43947233b">

- In the next page, Copy your environment variables and ignore the rest of the settings.
  <img width="656" alt="copy environment variables" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/08406e59-1ebf-4763-92f4-aa3ff0bad026">
  
- Paste the environment variable to the `.env.local` file created by `Convex` in the root of your project. 
<img width="903" alt="paste variables" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/7e36d397-2f6a-445e-8b2e-945b58daf727">

- On the sidebar, Click on *JWT templates*.
  <img width="896" alt="jwt templates" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/e851fee2-ed4d-45e3-b3c0-f2ebd9217826">
  
- Click on `New template` and select `Convex` in the list of available templates.
 <img width="869" alt="jwt template" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/6f2f0026-90ef-4477-945f-3a2a4f401978">

- This will take you to the `issuer key` page, Copy the `Issuer key`
  <img width="682" alt="copy issuer key" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/d186a78d-8cc8-4dd0-8275-d7fc706cfd8b">
  
- Save it your environment variables with this exact variable name.
```
CLERK_DOMAIN=https://<your issuer key>
```

### 6. Setting up Webhook.
 We need a webhook to communicate from Clerk to our backend. This is needed so that our backend will know when a new user or organization is created, then it will trigger a mutation event and save our users or organizations to our database automatically. Let's configure our `Webhook` with `Clerk`.

-  After pasting the `Issuer ` key to your `.env.local` file, click on `Webhooks` in the sidebar of `Clerk`. and Click on `Add Endpoint`
     <img width="881" alt="select webhook" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/bd8db773-dacb-4265-a2cc-d350a5a2af63">
     
- Next, we need to do a little trick here to create our app's endpoint that will communicate with the Clerk `Webhook`. We need to extract our `CONVEX_DEPLOYMENT` URL and then add `.convex.site/clerk` to it. We can get our `convex endpoint` in the `.env.local` file and create the `webhook` endpoint like this below:
  
  <img width="539" alt="convex endpoint url" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/d1ae7578-da07-4093-aa17-bc75abe6f5e4">
  
- Next, we need to add the `URL` to the Clerk `Endpoint URL` like this:
  <img width="626" alt="endpoint url" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/1760c998-d487-4d2c-9b7d-d9e9a1c24a38">

- After adding the _endpoint URL_, scroll down and choose the events that we will like Clerk to `POST` to our app. We only need the `organizationMembership.created` and `user.created` so that we get notified when a new user or organization is created.
  <div style="display: flex; justify-content: space-around;">
    <img width="362" alt="org membership created" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/39891e4b-b2b2-408d-83b3-affdf418b552">
    <img width="298" alt="user created filter" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/be31a754-c653-435a-adc6-dc802f41fe3f">
  </div>
  
- Next, click on `Create`. This will create the options and also create a `Signing Secret` that we should `Copy` and add to our `Convex` Dashboard later as our `CLERK_WEBHOOK_SECRET` environment variable. 
  <img width="622" alt="copy sign in secret" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/0a1c67de-013c-419f-8eba-6b25b4fa54a4">
  
- Finally, before moving on to Setting up `Convex`, we need to *Enable organizations* because organizations are disabled by default.
- After copying the  `Signing Secret`, Click on `Organizations` on the sidebar and then `Enable organizations`
  <img width="904" alt="enable organization in clerk" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/94385634-205b-47f9-ad76-127c73f9a2d8">

### 7. Setting up our Convex Backend
  Before we launch our app, we need to do some configurations to our backend.
    - Login to convex  [Convex](https://www.convex.dev) with the GitHub account you used to create your project in the `Convex CLI`
      <img width="857" alt="sign in to convex" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/e9051cac-ec5f-4610-851b-5a345ee4d2b2">
      
This will take you to your dashboard where you will see the project you created in your terminal
<img width="872" alt="convex project select" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/3a51b1dd-49b4-44b4-8bad-f6d8cafc9936">

-Let's navigate to the settings page on the side bar.
<img width="875" alt="convex settings" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/21da1271-54b7-41b3-8d19-9ad77e06452e">

- Select `Environment Variables` and Create an environment variable `CLERK_WEBHOOK_SECRET` and paste in the Clerk `Signing Secret` obtained earlier in the Clerk `Webhook page`.
- We also need to copy the `CLERK_DOMAIN` which we earlier added to our `.env.local` in the root of our project and add it to the Clerk environment variable as well.
It should look like something like this.
<img width="820" alt="clerk env variables" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/17964824-f923-43fb-9e9a-4c81745afcb1">

If everything is set according to this documentation, you should see this in the `Data` route of your `Convex` Dashboard.
<img width="898" alt="tables" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/39452936-5bd6-4ace-990d-58df4027daa5">


### 8. Start the project on local host:
- Go to your code editor and run this command.
```bash
npm run dev dev
```

### 9. Access the application in your web browser at `http://localhost:3000`.

## 📝 Additional Notes

- Should you need any clarification while setting up this project, please reach out to me at any time, and I am ever ready to be there for you.

### Made with 💖 by Mohammed Ak.
