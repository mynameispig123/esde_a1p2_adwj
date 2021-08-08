let $searchDesignFormContainer = $('#searchDesignFormContainer');
if ($searchDesignFormContainer.length != 0) {
    console.log('Search design form detected in user manage submission interface. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to send key-value pair information to do record searching
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = 'https://52.54.247.200:5000';
        let searchInput = $('#searchInput').val();
        let userId = sessionStorage.getItem('user_id');
        let token = sessionStorage.getItem('token');
        axios({
                headers: {
                    'user': userId,
                    authorization: 'Bearer ' + token
                },
                method: 'get',
                url: baseUrl + '/api/user/process-search-design/1/' + searchInput,
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically generates cards.
                //Each card describes a design record.
                //console.dir(response.data);
                const records = response.data.filedata;
                const totalNumOfRecords = response.data.total_number_of_records;
                //Find the main container which displays page number buttons
                let $pageButtonContainer = $('#pagingButtonBlock');
                //Find the main container which has the id, dataBlock
                let $dataBlockContainer = $('#dataBlock');
                $dataBlockContainer.empty();
                $pageButtonContainer.empty();
                if (records.length == 0) {
                    new Noty({
                        type: 'information',
                        layout: 'topCenter',
                        timeout: '5000',
                        theme: 'sunset',
                        text: 'No submission records found.',
                    }).show();
                }
                for (let index = 0; index < records.length; index++) {
                    let record = records[index];
                    console.log(record.cloudinary_url);
                    let $card = $('<div></div>').addClass('card').attr('style', 'width: 18rem;');
                    $card.append($('<img></img>').addClass('card-img-top').addClass('app_thumbnail').attr('src', record.cloudinary_url));
                    let $cardBody = $('<div></div>').addClass('card-body');
                    let $editDesignButtonBlock = $('<div></div>').addClass('col-md-2 float-right');
                    $editDesignButtonBlock.append($('<a>Update</a>').addClass('btn btn-primary').attr('href', 'update_design.html?id=' + record.file_id));
                    $cardBody.append($editDesignButtonBlock);
                    $cardBody.append($('<h5></h5>').addClass('card-title').text(record.design_title));
                    $cardBody.append($('<p></p>').addClass('card-text').text(record.design_description));
                    $card.append($cardBody);
                    //After preparing all the necessary HTML elements to describe the file data,
                    //I used the code below to insert the main parent element into the div element, dataBlock.
                    $dataBlockContainer.append($card);
                    $dataBlockContainer.append($('<h5></h5>'));
                } //End of for loop
                let totalPages = Math.ceil(totalNumOfRecords / 4);

                for (let count = 1; count <= totalPages; count++) {

                    let $button = $(`<button class="btn btn-primary btn-sm" />`);
                    $button.text(count);
                    $button.click(clickHandlerForPageButton);

                    $pageButtonContainer.append($button);
                } //End of for loop to add page buttons

            }).catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    timeout: '5000',
                    theme: 'sunset',
                    text: 'Unable to search',
                }).show();
            });
    });
    //I have hard code 3 buttons for the manage-submission interface (user role)
    //to cut down the JavaScript code for this file.
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to make a HTTP GET
    //to server-side api.
    function clickHandlerForPageButton(event) {
        event.preventDefault();
        const baseUrl = 'https://52.54.247.200:5000';
        let userId = sessionStorage.getItem('user_id');
        let pageNumber = $(event.target).text().trim();
        let searchInput = $('#searchInput').val();
        let token = sessionStorage.getItem('token');
        console.log(pageNumber);
        axios({
                headers: {
                    'user': userId,
                    authorization: 'Bearer ' + token
                },
                method: 'get',
                url: baseUrl + '/api/user/process-search-design/' + pageNumber + '/' + searchInput,
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically generates cards.
                //Each card describes a design record.
                //console.dir(response.data);
                const records = response.data.filedata;
                const totalNumOfRecords = response.data.total_number_of_records;
                //Find the main container which displays page number buttons
                let $pageButtonContainer = $('#pagingButtonBlock');
                //Find the main container which has the id, dataBlock
                let $dataBlockContainer = $('#dataBlock');
                $dataBlockContainer.empty();
                $pageButtonContainer.empty();
                for (let index = 0; index < records.length; index++) {
                    let record = records[index];
                    console.log(record.cloudinary_url);
                    let $card = $('<div></div>').addClass('card').attr('style', 'width: 18rem;');
                    $card.append($('<img></img>').addClass('card-img-top').addClass('app_thumbnail').attr('src', record.cloudinary_url));
                    let $cardBody = $('<div></div>').addClass('card-body');
                    let $editDesignButtonBlock = $('<div></div>').addClass('col-md-2 float-right');
                    $editDesignButtonBlock.append($('<a>Update</a>').addClass('btn btn-primary').attr('href', 'update_design.html?id=' + record.file_id));
                    $cardBody.append($editDesignButtonBlock);
                    $cardBody.append($('<h5></h5>').addClass('card-title').text(record.design_title));
                    $cardBody.append($('<p></p>').addClass('card-text').text(record.design_description));
                    $card.append($cardBody);
                    //After preparing all the necessary HTML elements to describe the file data,
                    //I used the code below to insert the main parent element into the div element, dataBlock.
                    $dataBlockContainer.append($card);
                    $dataBlockContainer.append($('<h5></h5>'));
                } //End of for loop
                let totalPages = Math.ceil(totalNumOfRecords / 4);
                console.log(totalPages);
                for (let count = 1; count <= totalPages; count++) {

                    $pageButtonContainer.append($('<button class="btn btn-primary btn-sm"></button>').text(count).on('click', clickHandlerForPageButton));
                }
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to search',
                }).show();
            });

    } //End of clickHandlerForPageButton
} //End of checking for $searchDesignFormContainer jQuery object
