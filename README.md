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
* [Access Details](#access-details)
* [Postman Requests Instruction](#postman-requests-instruction)

## Team Members

| Name 			| Student Number|
| :---       		|     :---:     |        
| Georgia Lewis         |  982172    	| 
| Karina Fitriani Liauw |  1090015     	|  
| Laurensia Livia Sugito|  1090328     	|   
| Woo Pei Yi    	|  1064538     	|  


## Technologies
Project is created with:
* NodeJs 14.16.X
* MongoDB


## Live Website
You can view our live website at `https://snacksinavan-group-2-info30005.herokuapp.com/`

## Access Details

Please create a file named `.env` inside the app folder and copy the database credentials below.

```
MONGO_USERNAME = group2

MONGO_PASSWORD = group2
```

To view the database from Mongo Compass, please paste this connection string.
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

**2. View details of a snack**

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | View A Snack Detail 		     |
| **URL**              | `/customer/snacks/:name`            |
| **Method** 	       | GET                 	 	     |
| **URL Params**       | **Required**<br>Snack Name<br>Example: name=Big Cake          |
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
| **URL Params**       | **Required**<br>Customer ID<br>Example: 607efeccaae89387de7663b4	|
| **Data Params**      | **Required**<br>Snack ID<br>Example: 607d4e62b544b956283d6c9a     |
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

1. Setting van status (vendor sends location, marksvan as ready-for-orders)
We will implement 2 buttons for the van to change their status.

The first button is used to update their status as **CLOSE** by changing their `ready_for_order` to `false`.

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | Update Van Status to Close 	     |
| **URL**              | `/vendor/:name/update-van-details/close`   |
| **Method** 	       | PUT                 	 	     |
| **URL Params**       | **Required**<br>Van Name<br>Example: name=Cool Van          |
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
| **URL Params**       | **Required**<br>Van Name<br>Example: Cool Van	|
| **Data Params**      | **Required**<br>Location Description and Geo Location [Latitude,Longitude]<br>Example: <code>{<br>"location_description": "Near The Spot Building", "location": [-37.806853,144.959451]}</code>|
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

2. Show list of all outstanding orders

|    <!-- -->          |        <!-- -->                     |
|----------------------|-------------------------------------|
| **Title**            | View A Van's Outstanding Orders     |
| **URL**              | `/vendor/:van_name/outstanding-orders` |
| **Method** 	       | GET                 	 	     |
| **URL Params**       | **Required**<br>Van Name<br>Example: Cool Van   |
| **Data Params**      | None                                |
| **Success Response** | Code: 200			     |

3. Mark an order as "fulfilled" (ready to be picked up by customer)



**Task List:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [ ] App server mockup
- [ ] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)

