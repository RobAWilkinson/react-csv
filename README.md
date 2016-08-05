# CSV React

Thanks to https://github.com/facebookincubator/create-react-app/ for their great boilerplate

# Getting started

1. `npm i`
2. `npm start`
3. Upload a csv and check out the console

## Capabilities,
* Parse and convert a raw css file into an array of javascript objects.
* Allow user to "match" headers according to your specification
* Update their matched headers on your server so they are mostly matched when user returns

## How it works:

Every field on the final object is a "Header" object, it has a "given" prop and a "needed" prop. the User can change the given. Ex: a header object could look like this `{ needed: "Region", given: "Student State" }`
Selecting from drop downs fires a redux action which updates these object and the table is changed accordingly.

When you finally finish matching all the headers, that next button will console log the final items, one can do with them what they will at that point.

## Moving Forward

* Ability to set a custom schema for headers
* ability to pass in components for cell and parent display
* Integrate datatable for viewing the components
