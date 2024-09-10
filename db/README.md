# TMS JSON database

A simple database based on JSON format

## Installation

Launch

```sh
npm install
```

## Run database

run following command to start db server:

```sh
npm run start:json-server
```

## Notes

`db.json` file already contains some sample data. **Please don't delete users for the demo!**.

DB format will be:
```sh
{
  "users": [
    {
      "id": "id",
      "username": "username",
      "name": "Name",
      "surname": "Surname",
      "password": "password",
      "color": "hexcolor"
    },
    ...
      ],
  "tasks": [  
    {
      "id": "id",
      "title": "title",
      "description": "description",
      "status": 0,
      "createdBy": "an_userid",
      "assignedTo": "an_userid"
    }
  ]
}
```