# My recipes

This App is realized as capstone project of Udacity Cloud Developer Nanodegree. It uses Serverless framework with AWS services for the backend and React for the frontend.

# Functionality

This application allow the authenticated user to

- build and update a personal profile
- upload an avatar
- consult a list of personal recipes
- create/edit/delete recipes
- upload images for each recipe

# How to run

## Backend

```
cd backend
npm install
sls deploy -v
```

## Client

To run a client application run the following commands:

```
cd client
npm install
npm run start
```

## Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true 'Image 1')

Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true 'Image 2')

Select a file to import:

![Alt text](images/import-collection-3.png?raw=true 'Image 3')

Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true 'Image 4')

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true 'Image 5')
