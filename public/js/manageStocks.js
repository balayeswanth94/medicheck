            var available_Med = <%- JSON.stringify(availableMed) %>;
            var total_Med = <%- JSON.stringify(totalMed) %>;
            var length = available_Med.length || 0;
            for (var j = 0; j < length; j++) {

                var newOption = $('<option/>');
                newOption.text(available_Med[j].name);
                newOption.attr('value', available_Med[j].name);
                console.log(newOption);
                $('#available').append(newOption);
            }
            var length = total_Med.length;
            for (var j = 0; j < length; j++) {
                var newOption = $('<option/>');
                newOption.text(total_Med[j].name);
                newOption.attr('value', total_Med[j].name);
                console.log(newOption);
                $('#total').append(newOption);
            }