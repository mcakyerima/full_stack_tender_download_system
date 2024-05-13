# Tender Download System

![landing-light](https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/080cc434-811f-41a6-bd5b-c6c54e662952)
![tendar-ipad](https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/a1ebd276-8202-41b2-a288-48f7ef594a0a)
![tender-main](https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/715cf12d-0e5f-4e1e-b16e-76d2a52ca9b4)
<div style="display: flex; justify-content: space-around;">
  <img src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/a313f056-08eb-4090-9410-d57cc76e5de7" alt="Tender Mobile Dark" width="300"/>
  <img src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/02475c0e-ea19-49b7-acdb-8ba4a90ebd99" alt="Tender Mobile Light" width="300"/>
</div>

## Description
📝 Tender Download System is a full-stack React-based web application built with typescript and React designed for browsing, sharing, and downloading tender documents. Users can create organizations, share tenders, view tender details, sort and filter, add to favorites, delete, and more features like Communicating with all documents using Generative Ai coming soon.

## Features

✨ **Functionality:**
- Browse a list of available tenders
- View tender details including title, description, and submission deadline
- Download tender documents
- Advance search functionality to filter tenders based on keywords
- User authentication and authorization with Clerk
- Users can create organizations, share tenders, add favorites, delete, and more
- Professional database setup and deployment using Convex
- Ability to Communicate with all tenders in realtime using Generative AI. `coming soon`.


🖥️ **User Interface:**
- Clean and user-friendly interface designed with React components
- Responsive design for different screen sizes (desktop, tablet, mobile)
- Error Handling with Zod and React Hook Forms.
- Custom Modals and Hooks that work on any device.

## Setup Instructions

Follow these Documentation to set up the project locally:

### 1. Clone the repository:

```bash
git clone https://github.com/mcakyerima/full_stack_tender_download_system.git
```

### 2. Navigate to the project directory and open in code editor or your choice, prefarably vscode:

```bash
cd full_stack_tender_download_system
```

### 3. Install dependencies:
   - in the vscode terminal, run this command and install dependencies and libraries

```bash
npm install
```

###4. Set up Convex environment:
 After the dependencies installation is finished, open a second new terminal in vscode and run this command
  ```bash
  npx convex dev
  ```
this command will open the convex `CLI` and ask you to select your Device name, after that it will open the browser to verify your `CLI` and signs you up, preferably you should log in with github. after running this command, convex will run all the schemas and the shema tests and validatins written in the convex directory and it will automaticlly create the database in your convex dashboard in the cloud.

The `npx convex dev` command will also create a `.env.local` file in the root of your project containing your `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`

example:
```
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=dev:clear-swordfish-343 # your convex deployment link

NEXT_PUBLIC_CONVEX_URL=https://clear-swordfish-343.convex.cloud

```


### 5. Set up Clerk for authentication and organization creation + OTP or email validation:
- Go to [Clerk](https://www.clerk.com) and sign up
- Create a new project and give it a name of your choice.
- Choose Login of your choice, prefabaly email and google.
  
  <img width="812" alt="createa app clerk 1" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/0fc7156e-c780-48fa-89b7-02a43947233b">

- In the next page, Copy your environment variables and ignore the rest of the settings.
  <img width="656" alt="copyenvironment 2" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/08406e59-1ebf-4763-92f4-aa3ff0bad026">
  
- Paste the envirnment variable the to the `.env.local` created by `Convex` in the root of your project. 
<img width="903" alt="variableas" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/7e36d397-2f6a-445e-8b2e-945b58daf727">

- On the sidebar, Click on *JWT templates*.
  <img width="896" alt="jwt templates 3" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/e851fee2-ed4d-45e3-b3c0-f2ebd9217826">
  
- Click on `New template` and select `Convex` in the list of available templates.
 <img width="869" alt="jwt tmplate" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/6f2f0026-90ef-4477-945f-3a2a4f401978">

- This will take you to the `isser key` page, Copy the `Issuer key`
  <img width="682" alt="copy issuer key 5" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/d186a78d-8cc8-4dd0-8275-d7fc706cfd8b">
  
- Save it your enviroment variables with this exact variable name.
```
CLERK_DOMAIN=https://<your issuer key>
```

### 6. Setting up Webhook.
 We need webhook to communicate from clerk to our backend, this is needed so that our backend will know when a new user or organization is created, then it will trigger a mutation event and save our users or organizations to our database automatically. lets configure our `Webhook` with `Clerk`.

-  After pasting the `Issuer ` key to your `.env.local` file, click on `Webhooks` in the sidebar of `Clerk`. and Click on `Add Endpoint`
     <img width="881" alt="select webhook 12" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/bd8db773-dacb-4265-a2cc-d350a5a2af63">
     
- Next we need to do a little trick here in other to create our apps endpoint that will communicate with the clerk `Webhook`, we need to extract  our `CONVEX_DEPLOYMENT` url and then add `.convex.site/clerk` to it, we can get our `convex endpoint` in the `.env.local` file and create the `webhook` endpoint like this below:
  <img width="539" alt="convex endpoint url 11" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/d1ae7578-da07-4093-aa17-bc75abe6f5e4">
  
- Next we need to add the `URL` to the Clerk `Endpoint URL` like this:
  <img width="626" alt="endpoint url 13" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/1760c998-d487-4d2c-9b7d-d9e9a1c24a38">

- After adding the _endpoint url_, scroll down and choose the events that we will like clerk to `POST` to our app, we only need the `organizationMembership.created` and `user.created` so that we get notified when a new user or organization is created.
  <div style="display: flex; justify-content: space-around;">
    <img width="362" alt="org membership created 14" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/39891e4b-b2b2-408d-83b3-affdf418b552">
    <img width="298" alt="user created filter 15" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/be31a754-c653-435a-adc6-dc802f41fe3f">
  </div>
  
- Next click on `Create` this will create the options and also create a `Signing Secret` that we should `Copy` and add to our `Convex` Dashboard later as our `CLERK_WEBHOOK_SECREET` _enviroment variable_. 
  <img width="622" alt="copy sign in secret 16" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/0a1c67de-013c-419f-8eba-6b25b4fa54a4">
  
- Finally before moving on to Setting up `Convex`, we need to *Enable organizations* because organizations is disabled by default.
- After copying the  `Signing Secret` Click on `Organizations` on the sidebar and then `Enable organizations`
  <img width="904" alt="enable organization in clerk 18" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/94385634-205b-47f9-ad76-127c73f9a2d8">

### 7. Setting up our Convex Backend
  Before we lunch our app, we need to do some configurations to our backend.
    - Login to convex  [Convex](https://www.convex.dev) with the github account you used to create your project in the `Convex CLI`
      <img width="857" alt="sign in to convex 7" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/e9051cac-ec5f-4610-851b-5a345ee4d2b2">
      
this will take you to your dashboard where you will see the project you created in your terminal
<img width="872" alt="convex project select 8" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/3a51b1dd-49b4-44b4-8bad-f6d8cafc9936">

-Lets navigate to the settings page on the side bar.
<img width="875" alt="convex settings 9" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/21da1271-54b7-41b3-8d19-9ad77e06452e">

- Select `Environment Variables` and Create an enviroment `CLERK_WEBHOOK_SECRET` and paste in the Clerk `Signing Secret` obtained earlier in the Clerk `Webhook page.
- We also need to copy the `CLERK_DOMAIN` which we ealier added to our `.env.local` in the root of our project and add it to the Clerk enviroment variable as well.
It should look like something like this.
<img width="820" alt="clerk env variables" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/17964824-f923-43fb-9e9a-4c81745afcb1">

If everything is set according to this documentation you should see This in the `Data` route of your `Convex` Dashboard.
<img width="898" alt="tables" src="https://github.com/mcakyerima/full_stack_tender_download_system/assets/58314409/39452936-5bd6-4ace-990d-58df4027daa5">


### 8. Start the project on local host:
- Go to your code editor and run this command.
```bash
npm run dev dev
```

### 9. Access the application in your web browser at `http://localhost:3000`.

### Additional Notes

- Should you need any clarification while setting up this project, please reachout to me at anytime and i am ever ready to be there sir's.

### Made with 💖 by Mohammed Ak.
