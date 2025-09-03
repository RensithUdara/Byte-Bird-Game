class AudioControl {
    constructor() {
        this.charge = document.getElementById('charge');
        this.flap1 = document.getElementById('flap1');
        this.flap2 = document.getElementById('flap2');
        this.flap3 = document.getElementById('flap3');
        this.flap4 = document.getElementById('flap4');
        this.flap5 = document.getElementById('flap5');

        this.flapSounds = [this.flap1, this.flap2, this.flap3, this.flap4, this.flap5];

        this.win = document.getElementById('win');
        this.lose = document.getElementById('lose');
        
        // Create additional sounds for new features
        this.powerup = this.createSound('powerup', 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//NIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAABEAABwpgAGCQ0QExYZHB8jJiktMDM2OT1AREVIS05RVVhbXmFlaGxvc3Z5fH+Dho+SlpmdoaSnqq2ws7a6vcDDx8rN0NPW2dzf4uXo6+7x9Pf6/f8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAQgAAAAAAAAcKa542ZSAAAAAAAAAAAAAAAAAAAAAAAA//NIxAAPwTowAEGQAUYzMzMzMzMzMzMzMzMzMzNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==');
        this.shield = this.createSound('shield', 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//NIwAAAAAAAAAAAAFhpbmcAAAAPAAAAAwAAA+sAZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGR9fX19fX19fX19fX19fX19fX19fX19fX19fX3JycnJycnJycnJycnJycnJycnJycnJycnJycn///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJASAAAAAAAAAAPrvaKT5AAAAAAAAAAAAAAAAAAAA//MYxAALCAYgQAAAABLIU9/IFCRJR3nP/p5EIsD+BfAhAQDg4HAEzkhkZ//NIxBUKWdowAZhIAGjnd8HjJBtQuFQZHf/EyIEoHCREhH0KlJ5ndGTRohUKrCXxzp9nOc6fB8HwfQfD4PwfA+AUK//NIxBwKccZkAY84AOsoKzBv8GFWbupiBAYLLhYKt4it0JgyBGDK8BYZS1UxMLpcwSlTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxCcJmPJgAcwwAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
        this.slowTime = this.createSound('slowTime', 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//NIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhpbmcAAAAPAAAAAwAABTMAICAgICAgICAgICAgICAgICAgICAgICAgICAgPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/j4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+PAAAAAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAPgAAAAAAAABTOytTWIAAAAAAAAAAAAAAAAAAAA//NIxAAPgTYcAEGQAURKr9IitXESRFVTdVOIt3MzBEbdIi1qkReHYgANMUBgMGhDjvQgcP+A5/qBcPq5znBAACAgAABS//NIxA8OATJEAHmMTCvy5dLCfxASASAgBVz4QuX4QYcOHDgAB+X9QOXIPw/D4fqOH0SA/EYjcyIxGI3EYj//MRmUymYj//NIxBgLEXowAMYecDMzMzMeZmZ//mZmf//eZDMYZmaZmZ//8OGf/+YcOHwR//8MP//Bg/EhhyAw//9RMQUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    }
    
    createSound(id, dataUrl) {
        // Create audio element
        const audio = document.createElement('audio');
        audio.id = id;
        audio.src = dataUrl;
        document.querySelector('.assets').appendChild(audio);
        return audio;
    }
    play(sound){
        sound.currentTime = 0;
        sound.play();
    }
}
