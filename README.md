**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Tutorial 8 Group 2 Project Repository
## Snacks in A Van
Welcome!

This is a project to create web apps for 'Snacks in A Van' a new startup company operating in Melbourne.
There will be 2 web apps, one for the customers and one for the vendors.

## Table of contents
* [Team Members](#team-members)
* [Technologies](#technologies)
* [Live Website](#live-website)
* [Commit ID](#commit-id)
* [Getting Started](#getting-started)
* [Database Access Details](#database-access-details)
* [Postman Requests Instruction](#postman-requests-instruction)
* [Login Details](#login-details)

## Team Members

| Name 			        | Student Number|
| :---       		    |     :---:     |        
| Georgia Lewis         |  982172    	| 
| Karina Fitriani Liauw |  1090015     	|  
| Laurensia Livia Sugito|  1090328     	|   
| Woo Pei Yi    	    |  1064538     	|  


## Technologies
Project is created with:
* NodeJs
* MongoDB
* HTML, CSS, Javascript & Handlebars

## Live Website
You can view our live website at `https://snacksinavan-group-2-info30005.herokuapp.com/`

## Commit ID
The commit id for marking: `*fill*`

## Getting Started

To set the environment variables:

Please create a file named `.env` inside the app folder and copy the database credentials below.

```
MONGO_USERNAME = group2

MONGO_PASSWORD = group2

PASSPORT_KEY = group2
```


To install the dependencies:
```
npm install
```
To run the program:
```
npm start
```
You will see this output if successful
```
> snacksinavan@1.0.0 start
> node app.js

The Snacks in a Van app is running on por!
Mongo connection started on cluster0-shard-00-00.7qkom.mongodb.net:27017
```
## Database Access Details

To view the database from Mongo Compass, please navigate to File -> Connect and paste this connection string.
`mongodb+srv://group2:group2@cluster0.7qkom.mongodb.net/snacksinavan?retryWrites=true&w=majority`

## Postman Requests Instruction
### Customer

**1. View menu of snacks (including pictures and prices)**

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | View All Snacks 		     |
| **URL**              | `/customer/snacks`                  |
| **Method** 	       | GET                 	 	     |
| **URL Params**       | None                                |
| **Data Params**      | None                                |
| **Success Response** | Code: 200			     |

**Example Request:**

`https://snacksinavan-group-2-info30005.herokuapp.com/customer/snacks`

**Example Response:** 
```
[
    {
        "_id": "607d4d71aae89387de7663ad",
        "name": "Cappuccino",
        "price": 4,
        "photo": "https://unsplash.com/photos/J-4ozdP9EQ0"
    },
    {
        "_id": "607d4e26b544b956283d6c99",
        "name": "Flat White",
        "price": 5,
        "photo": "https://unsplash.com/photos/ad38qCSnjVc"
    },
    ... (etc)
]
```
**2. View details of a snack**

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | View A Snack Detail 		     |
| **URL**              | `/customer/snacks/:name`            |
| **Method** 	       | GET                 	 	     |
| **URL Params**       | **Required**<br>Snack Name<br>(View available snacks here: https://snacksinavan-group-2-info30005.herokuapp.com/customer/snacks and use the field `name`)<br>Example: name=Big Cake          |
| **Data Params**      | None                                |
| **Success Response** | Code: 200			     |

**Example Request:**

`https://snacksinavan-group-2-info30005.herokuapp.com/customer/snacks/Big Cake`

**Example Response:** 

```
{
    "_id": "607d4f19b544b956283d6c9f",
    "name": "Big Cake",
    "price": 25,
    "photo": "https://unsplash.com/photos/wp4ZYmUuJBk"
}
```

**3. Customer starts a new order by requesting a snack**

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | Customer Request A Snack            |
| **URL**              | `/customer/:id/order`               |
| **Method** 	       | POST                 	 	     |
| **URL Params**       | **Required**<br>Customer ID<br>(View available customers here: https://snacksinavan-group-2-info30005.herokuapp.com/customer and use the field `_id`)<br>Example: 607efeccaae89387de7663b4	|
| **Data Params**      | **Required**<br>Snack ID<br>(View available snacks here: https://snacksinavan-group-2-info30005.herokuapp.com/customer/snacks and use the field `_id`)<br>Example: 607d4e62b544b956283d6c9a     |
| **Success Response** | Code: 200			     |

**Example Request:**

URL:

`https://snacksinavan-group-2-info30005.herokuapp.com/customer/607efeccaae89387de7663b4/order`

Body:
```
{
    "snackId": "607d4e62b544b956283d6c9a"
}
```
**Example Response:** 

```
{
    "_id": "607efeccaae89387de7663b4",
    "email": "max1234@gmail.com",
    "password": "max123",
    "nameGiven": "Max",
    "nameFamily": "Verstappen",
    "cart": [
        {
            "_id": "6080412b0a265f001532d786",
            "snackId": "607d4e62b544b956283d6c9a"
        }
    ],
    "__v": 6
}
```

### Vendor

**1. Setting van status (vendor sends location, marksvan as ready-for-orders)
We will implement 2 buttons for the van to change their status.**

The first button is used to update their status as **CLOSE** by changing their `ready_for_order` to `false`.

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | Update Van Status to Close 	     |
| **URL**              | `/vendor/:name/update-van-details/close`   |
| **Method** 	       | PUT                 	 	     |
| **URL Params**       | **Required**<br>Van Name<br>(View available vans here: https://snacksinavan-group-2-info30005.herokuapp.com/vendor and use the field `name`)<br>Example: name=Cool Van          |
| **Data Params**      | None                                |
| **Success Response** | Code: 200			     |

**Example Request:**

`https://snacksinavan-group-2-info30005.herokuapp.com/vendor/Cool Van/update-van-details/close`

**Example Response:** 

```
{
    "location": [
        -37.806853,
        144.959451
    ],
    "_id": "607d5729aae89387de7663af",
    "name": "Cool Van",
    "location_description": "Near The Spot Building",
    "ready_for_order": false,
    "__v": 3
}
```
The second button is used to send their location, location description and change their status to **OPEN**. 
Open status is denoted by `ready for order` as `true`.

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | Update Van Status to Open + Location |
| **URL**              | `/vendor/:name/update-van-details/open` |
| **Method** 	       | POST                 	 	     |
| **URL Params**       | **Required**<br>Van Name<br>(View available vans here: https://snacksinavan-group-2-info30005.herokuapp.com/vendor and use the field `name`)<br>Example: Cool Van	|
| **Data Params**      | **Required**<br>Location Description (String) and Geo Location [Latitude Number,Longitude Number]<br>Example: <code>{<br>"location_description": "Near The Spot Building", "location": [-37.806853,144.959451]}</code>|
| **Success Response** | Code: 200			     |

**Example Request:**

URL:

`https://snacksinavan-group-2-info30005.herokuapp.com/vendor/Cool Van/update-van-details/open`

Body:
```
{
    "location_description": "Near The Spot Building",
    "location": [-37.806853,144.959451]
}
```
**Example Response:** 

```
{
    "location": [
        -37.806853,
        144.959451
    ],
    "_id": "607d5729aae89387de7663af",
    "name": "Cool Van",
    "location_description": "Near The Spot Building",
    "ready_for_order": true,
    "__v": 3
}
```

**2. Show list of all outstanding orders**

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | View All Outstanding Orders     |
| **URL**              | `/vendor/:van_name/outstanding-orders` |
| **Method** 	       | GET                 	 	     |
| **URL Params**       | **Required**<br>Van Name<br>(View available vans here: https://snacksinavan-group-2-info30005.herokuapp.com/vendor and use the field `name`)<br>Example: Cool Van   |
| **Data Params**      | None                                |
| **Success Response** | Code: 200			     |

**Example Request:**

`https://snacksinavan-group-2-info30005.herokuapp.com/vendor/Cool Van/outstanding-orders`

**Example Response:** 

```
[
    {
        "items": [
            "607d4d71aae89387de7663ad",
            "607d4e62b544b956283d6c9a"
        ],
        "_id": "60806ff3b544b956283d6ca2",
        "order_id": 2,
        "customer": "Hamilton",
        "time_ordered": "2021-04-21T14:12:00.000Z",
        "fulfilled": false,
        "picked_up": false,
        "discount": false,
        "van": "607d5729aae89387de7663af"
    },
    {
        "items": [
            "607d4d71aae89387de7663ad",
            "607d4e62b544b956283d6c9a"
        ],
        "_id": "6080701fb544b956283d6ca3",
        "order_id": 3,
        "customer": "Ricciardo",
        "time_ordered": "2021-04-21T14:10:00.000Z",
        "fulfilled": false,
        "picked_up": false,
        "discount": false,
        "van": "607d5729aae89387de7663af"
    }
]
```

**3. Mark an order as "fulfilled" (ready to be picked up by customer)**


|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | Mark Order As Fulfilled             |
| **URL**              | `vendor/:name/outstanding-orders/:order_id/fulfilled` |
| **Method** 	       | PUT                 	 	     |
| **URL Params**       | **Required**<br><ul><li> Van Name <br>(View available vans here: https://snacksinavan-group-2-info30005.herokuapp.com/vendor and use the field `name`)</li><br><li>Order ID in outstanding order list (View the vans' outstanding order list here: https://snacksinavan-group-2-info30005.herokuapp.com/vendor/van_name/outstanding-orders **DON'T FORGET TO PUT THE VAN NAME IN van_name** and then use the field 'order_id')</li></ul><br>Example: Van Name = Cool Van, Order ID = 1  |
| **Data Params**      | None                                |
| **Success Response** | Code: 200			     |

**Example Request:**

`https://snacksinavan-group-2-info30005.herokuapp.com/vendor/Cool Van/outstanding-orders/1/fulfilled`

**Example Response:** 

```
{
    "items": [
        "607d4d71aae89387de7663ad",
        "607d4e62b544b956283d6c9a"
    ],
    "_id": "60806730aae89387de7663b6",
    "order_id": 1,
    "customer": "Verstappen",
    "time_ordered": "2016-01-24T02:21:55.000Z",
    "fulfilled": true,
    "picked_up": false,
    "discount": false,
    "van": "607d5729aae89387de7663af"
}
```
## Login Details
### Customer Login
Customer login example details:

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Email**            | admin@gmail.com   |
| **Password**         | Admin123456 |
| **Details**       | Should redirect to the customer home page if login is successful, otherwise redirect to the customer login page |

### Van Login

Van login example details:

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Vendor Name**      | SisterCoffee   |
| **Password**         | Sister123456 |
| **Details**       | Should redirect to the customer home page if login is successful, otherwise redirect to the vendor login page |


**Task List:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [x] App server mockup
- [x] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)

