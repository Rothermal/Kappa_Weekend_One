/**
 * Created by JFCS on 2/26/16.
 */
var employeeArray = [];
var total = 0;
var primaryKey = 0;

//var marvelArray=[];

$(document).ready(function(){
    init();
    enable();

});

function init(){
   for(var i = 0; i < employeeArray.length; i++) {
       appendDom(employeeArray[i]);

   }
    calcMonthlyPayroll(employeeArray);
}

function enable(){
    $('.empContainer').on('click','.delete',deleteEmployee);
    $('#employee-form').on('submit',processForm);

}

// moved all appending into ajax callback for now, was having async issues, will work on combining these functions
function appendDom(employee){
    primaryKey++;
    employee.key = primaryKey;
    marvel(employee);
    console.log(employee.image);

    //$('.empContainer').append("<div class='well col-sm-4'></div>");
    //$el = $('.empContainer').children().last();
    //$el.data('data',employee.key);
    //$el.append('<p>' + employee.firstName + '</p>');
    //$el.append('<p>' + employee.lastName + '</p>');
    //$el.append('<p>' + employee.employeeId + '</p>');
    //$el.append('<p>' + employee.employeeTitle + '</p>');
    //$el.append('<p>' + employee.employeeSalary + '</p>');
    //$el.append('<img src='+employee.image+' >');
    //$el.append('<button class="btn btn-danger delete"> remove employee </button>');
}

function Employee(firstname, lastname, id , title, salary ) {
    this.firstName = firstname;
    this.lastName = lastname;
    this.employeeId = id;
    this.employeeTitle = title ;
    this.employeeSalary = salary ;
    //this.key = keycount;
    employeeArray.push(this);
}

var cyclops = new Employee('Scott','Summers',1963,"Cyclops",12000);
var profX = new Employee('Charles','Xavier',1963,"Professor X",12000);
var magneto = new Employee('Max','Eisenhardt',1963,"Magneto",24000);
var beast = new Employee('Hank','Mccoy',1963,"Beast",24000);
var spidey = new Employee('Peter','Parker',1963,"Spider-Man",24000);
var ghostRider = new Employee('Johnny','Blaze',1940,"Ghost Rider",24000);
var starLord = new Employee('Peter','Quill',1976,"Star-Lord",24000);
var doctorStrange = new Employee('Vincent','Strange',1963,"Doctor Strange",36000);


function deleteEmployee(){
    removeFromPayroll($(this).parent().data().data);
    $(this).parent().remove();
}


function processForm(event){
    event.preventDefault();
    var values = {};
    $.each($('#employee-form').serializeArray(), function(i,field){
        values[field.name] = field.value;
    });
    console.log(values);
    appendDom(values);
    employeeArray.push(values);
    $('#employee-form').find('input[type=text],input[type=number]').val("");
    calcMonthlyPayroll(employeeArray);

}

function calcMonthlyPayroll(employeeArray) {
    total = 0;
    for (var i = 0; i < employeeArray.length; i++) {
        if (employeeArray[i].employeeSalary) {
            total += (parseInt(employeeArray[i].employeeSalary) / 12);
        }
    }
    $('.total-monthly-salary').html('Current Monthly Payroll is : $' + total);
}
console.log(employeeArray);

function removeFromPayroll(data){
    console.log(data);
    for(var i = 0; i < employeeArray.length; i++) {
        if (data == employeeArray[i].key){
            employeeArray.splice(i,1);
            calcMonthlyPayroll(employeeArray);
        }
    }
}

function marvel (employee){
    var name = employee.employeeTitle;
    var marvelapi = {};
    $.ajax({
        type:'GET',
        url: "http://gateway.marvel.com//v1/public/characters?nameStartsWith="+name+"&",
        data:
        {"apikey":"d585431f4c1290561110dd9e60330887",
        "ts": "1456602377",
        "hash": "bd16a3bcd9a050ba9ddc2d71b81f4ce4"},
        headers: {   Accept:'*/*' },
        success: function(response){
            console.log(response);
            marvelapi = response.data.results[0];
            //marvelArray.push(marvelapi);
            if(marvelapi.length === 0) {
                employee.image = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/standard_xlarge.jpg";
            } else {
                employee.image = marvelapi.thumbnail.path + "/standard_xlarge.jpg";
            }
            $('.empContainer').append("<div class='well col-sm-4'></div>");
            $el = $('.empContainer').children().last();
            $el.data('data',employee.key);
            $el.append('<p>' + employee.firstName + '</p>');
            $el.append('<p>' + employee.lastName + '</p>');
            $el.append('<p>' + employee.employeeId + '</p>');
            $el.append('<p>' + employee.employeeTitle + '</p>');
            $el.append('<p>' + employee.employeeSalary + '</p>');
            $el.append('<img src=' + employee.image + ' >');
            $el.append('<button class="btn btn-danger delete"> remove employee </button>');
        }
    });


}


