# FORMOSA'S POLYTECHNIC INSTITUTE.
## HIGHER TECHNICIAN MULTIPLATAFORM SOFTWARE DEVELOPMENT.

### Back-end development with __Node.js__ and **Express**.
## Tools:
<div align="center" style="display: flex">
    <span>
        <a href="https://es.javascript.info/" target="_blank">
            <img width="100" style="margin: 10" title='JavaScript' src='https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png'>
        </a>
    </span>
    <span>
        <a href="https://nodejs.org/en/" title='NodeJS' target="_blank">
            <img width="100" src='https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg'>
        </a>
    </span>
    <br/>
    <span>
        <a href="https://www.mongodb.com/docs/" title='MongoDB' target="_blank">
            <img width="200" src='https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg'>
        </a>
    </span>
    <span>
        <a href="https://mongoosejs.com/" title='Mongoose' target="_blank">
            <img width="200" src='https://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png'>
        </a>
    </span>
    <span>
        <a href="https://expressjs.com/es/" title='ExpressJS' target="_blank">
            <img width="200" src='https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png'>
        </a>
    </span>

    
</div>

## Description:
> This project is an implementation of the material studied on the subject in the institute in the subject "Programming Language Workshop II".
> It is the back-end part of a simple application which allows you to handle tasks (create new tasks, get a list of created tasks, it allows you to edit tasks and delete them too).
> At the same time, this app admit multi-users with authentication and authorization through **[JSONWEBTOKEN][1]**


### In order to run this project, you need to have installed:  __Node.js__  and __npm__.


### Verify the Node version with:
```bash
node -v
```

### Verify the npm version with:
```bash	
npm -v
```

### In order to install the dependencies which are needed in this project, execute the next command:

```bash
npm install
```

### To run this project, execute the next command:

```bash
npm run dev
```

### To clone this project on a local directory, execute the next command:

```bash
git clone https://github.com/MARnVEL/newMarnVelBattleServer.git
```
## Database Issues:
### Locally:
> By default the project runs on a local mode.
> In order to work correctly with data locally you need to have installed **Mongo Compass**:
>> Create a local conection with the string "mongodb://localhost:27017"
>> Then run the project!
> A database will be created automatically. Finally you can start to make some requests to the server using either **Postman** or **ThunderClient** or any other request/response software.


### Remote:
> Comment the lines from 27 to 31 in file "connection.database.js" and uncomment the lines corresponding to the remote connection from line 21 to 25 at the same file.
> In order to work correctly with data on the cloud you need to have a account in **Mongo Atlas DB**  and create a Cluster.
>> 


[1]: https://jwt.io/


