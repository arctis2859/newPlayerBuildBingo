(function() {
    easterEgg();
}())

function easterEgg() {
    $('.easter-egg').click(function(event) {
        event.preventDefault();
        $(this).prop('disabled', true);
        $('.bingo-board').addClass('hide');
        $('.reroll-container').addClass('hide');
        $('.flashbang-cat').addClass('show');
        $('.flashbang-cat').attr('src', 'assets/flashbang.gif');

        setTimeout(_ => {
            $('.background').removeClass('hide');

            $('.background').delay(0).fadeOut(2500, _ => {
                $('.background').addClass('hide').attr('style', '');
            });
        }, 4450);

        setTimeout(_ => {
            $('.bingo-board').fadeIn(300).removeClass('hide').attr('style', '');
            $('.reroll-container').fadeIn(300).removeClass('hide').attr('style', '');
            $('.flashbang-cat').removeClass('show');
            $('.flashbang-cat').attr('src', '');
            $(this).delay(3000).prop('disabled', false);
        }, 4650)
    })
}