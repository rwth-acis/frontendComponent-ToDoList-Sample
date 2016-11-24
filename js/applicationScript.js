/*
 * Copyright (c) 2015 Advanced Community Information Systems (ACIS) Group, Chair
 * of Computer Science 5 (Databases & Information Systems), RWTH Aachen
 * University, Germany All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name of the ACIS Group nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var client;

var init = function() {

  var iwcCallback = function(intent) {
    // define your reactions on incoming iwc events here
    // iwc response calls the function responseAction
    console.log(intent);
    if (intent.action == "test") {
      responseAction(intent.data);
    }
  };

  client = new Las2peerWidgetLibrary("http://localhost:8080/ToDoList", iwcCallback);
  // call the initial table when page is reloaded
  getTable();
  // events according to button clicking
  // send button
  $('#createItem').on('click', function() {
    createItem();
  })
  // delete button
  $('#deleteItem').on('click', function() {
    deleteItem();
  })
  // update button
  $('#updateItem').on('click', function() {
    UpdateMessage();
  })
}
// getTable function retrieves all the data from backend
var getTable = function(){
  // retrieve the data using get method
  client.sendRequest("GET", "", "", "application/json", {}, false,
  function(data, type) {
      $("#content").html("");

      //Append elements for each entry in the list
      for(var item in data) {
        var id = data[item].id;
        var caption = data[item].caption;
        var message = data[item].message;
        if(caption.length > 0){
          var html = "<div class='item' id="+ id +"><hr/><h4>"+ caption +"</h4><p>"+ message +"</p></div>";
          $("#content").append(html);
        }     
      }

      //Add click handlers
      $('.item').on('click',function() {
        var id = $(this).attr('id');
        loadItem(id);
      })
      // sends an iwc calling to Display widget, where the retrieved data will be displayed
      // client.sendIntent("showTable", data);
  },
  function(error) {
    console.log(error);
  });
}

var loadItem = function(id) {
  var caption = $("#"+id).find("h4").text();
  var message = $("#"+id).find("p").text();
  $('#captionField').val(caption);
  $('#contentField').val(message);
  $('#deleteID').val(id);
}

// DeleteID function deletes each row table by id
var deleteItem = function(){
  var deleteId = $('#deleteID').val();
  // delete method deleting DeleteID
  client.sendRequest("DELETE", deleteId, "", "application/json", {}, false,
  function(data, type) {
        getTable();
  },
  function(error) {
       console.log(error);
  });
}
// Sent Caption function sends the caption and message in backend
var createItem = function(){
  var content = new Object();
  content.caption = $('#captionField').val();
  content.message = $('#contentField').val();

  // post method for creating the new item
  client.sendRequest("POST", "", JSON.stringify(content), "application/json", {}, false,
  function(data, type) {
    getTable();
  }, 
  function(error) {
    console.log(error);
  });
}
// Update Message function for updating each message and caption by id
var UpdateMessage = function()
{
  var content = new Object();
  content.caption = $('#captionField').val();
  content.message = $('#contentField').val();
  content.id = $('#deleteID').val();
  // put method updating UpdateContent where all data is saved as a variable
  client.sendRequest("PUT", content.id, JSON.stringify(content), "application/json", {}, false,
  function(data, type) {
    getTable();
  },
  function(error) {
    console.log(error);
  });
}
// responseAction function as a response for iwc call intent coming from Display widget
var responseAction = function(data , type){
// display data accordingly in each text area
    $('#DeleteID').val(data.split(",")[0]);
  $('#ToDoList').val(data.split(",")[1]);
  $('#MessageContent').val(data.split(",")[2]);
}
// call the initial function when widget is reloaded
$(document).ready(function() {
  init();
});
