use salem_core::{CardType, Game, NewGameError};

#[test]
fn should_return_an_error_if_there_are_too_few_players() {
    let error = Game::new(1).expect_err("Expected too few players error");

    assert_eq!(
        error,
        NewGameError::TooFewPlayersError(1),
        "Expected too few players error"
    );
}

#[test]
fn should_give_five_cards_to_each_player_if_there_are_four_or_more_players() {
    let game = Game::new(4).expect("Expected game to be created");
    let players = game.players_still_alive();

    assert_eq!(players.len(), 4, "Expected 4 players");

    for player in players {
        assert_eq!(
            player.tryal_cards_remaining(),
            5,
            "Expected 5 cards per player"
        );
    }
}

#[test]
fn should_give_five_cards_to_each_player_if_there_are_six_or_less_players() {
    let game = Game::new(6).expect("Expected game to be created");
    let players = game.players_still_alive();

    assert_eq!(players.len(), 6, "Expected 6 players");

    for player in players {
        assert_eq!(
            player.tryal_cards_remaining(),
            5,
            "Expected 5 cards per player"
        );
    }
}

#[test]
fn should_give_four_cards_to_each_player_if_there_are_seven_or_more_players() {
    let game = Game::new(7).expect("Expected game to be created");
    let players = game.players_still_alive();

    assert_eq!(players.len(), 7, "Expected 7 players");

    for player in players {
        assert_eq!(
            player.tryal_cards_remaining(),
            4,
            "Expected 4 cards per player"
        );
    }
}

#[test]
fn should_give_four_cards_to_each_player_if_there_are_nine_or_less_players() {
    let game = Game::new(9).expect("Expected game to be created");
    let players = game.players_still_alive();

    assert_eq!(players.len(), 9, "Expected 9 players");

    for player in players {
        assert_eq!(
            player.tryal_cards_remaining(),
            4,
            "Expected 4 cards per player"
        );
    }
}

#[test]
fn should_give_three_cards_to_each_player_if_there_are_ten_or_more_players() {
    let game = Game::new(10).expect("Expected game to be created");
    let players = game.players_still_alive();

    assert_eq!(players.len(), 10, "Expected 10 players");

    for player in players {
        assert_eq!(
            player.tryal_cards_remaining(),
            3,
            "Expected 3 cards per player"
        );
    }
}

#[test]
fn should_give_three_cards_to_each_player_if_there_are_twelve_or_less_players() {
    let game = Game::new(12).expect("Expected game to be created");
    let players = game.players_still_alive();

    assert_eq!(players.len(), 12, "Expected 12 players");

    for player in players {
        assert_eq!(
            player.tryal_cards_remaining(),
            3,
            "Expected 3 cards per player"
        );
    }
}

#[test]
fn should_return_an_error_if_there_are_too_many_players() {
    let error = Game::new(13).expect_err("Expected too many players error");

    assert_eq!(
        error,
        NewGameError::TooManyPlayersError(13),
        "Expected too many players error"
    );
}

#[test]
fn should_reduce_the_card_amount_of_the_targeted_player_by_one_if_the_revealed_card_is_not_a_witch()
{
    let game = Game::new(4).expect("Expected game to be created");

    let bob = game
        .get_player_by_position(1)
        .expect("Expected player to be found");

    assert_eq!(
        game.players_still_alive().len(),
        4,
        "Expected 4 alive players"
    );
    assert_eq!(
        bob.tryal_cards_remaining(),
        5,
        "Expected 5 cards before revealing the card"
    );

    let game = game.reveal_tryal_card(bob, &CardType::NotAWitch);

    let bob = game.get_player_by_position(1).unwrap();

    assert_eq!(
        game.players_still_alive().len(),
        4,
        "Expected 4 alive players"
    );
    assert_eq!(
        bob.tryal_cards_remaining(),
        4,
        "Expected 4 cards after revealing the card"
    );
}

#[test]
fn should_kill_the_targeted_player_if_the_revealed_card_is_a_witch() {
    let game = Game::new(4).expect("Expected game to be created");

    let bob = game
        .get_player_by_position(1)
        .expect("Expected player to be found");

    assert_eq!(
        game.players_still_alive().len(),
        4,
        "Expected 4 alive players"
    );
    assert_eq!(
        bob.tryal_cards_remaining(),
        5,
        "Expected 5 cards before revealing the card"
    );

    let game = game.reveal_tryal_card(bob, &CardType::Witch);

    let bob = game
        .get_player_by_position(1)
        .expect("Expected player to be found");

    assert_eq!(
        game.players_still_alive().len(),
        3,
        "Expected 3 alive players"
    );
    assert_eq!(
        bob.tryal_cards_remaining(),
        0,
        "Expected 0 cards after revealing the card"
    );
}

#[test]
fn should_remove_all_cards_from_the_targeted_players() {
    let game = Game::new(4).expect("Expected game to be created");

    let bob = game
        .get_player_by_position(1)
        .expect("Expected player to be found");

    let david = game
        .get_player_by_position(3)
        .expect("Expected player to be found");

    assert_eq!(
        game.players_still_alive().len(),
        4,
        "Expected 4 alive players"
    );
    assert_eq!(
        bob.tryal_cards_remaining(),
        5,
        "Expected 5 cards before revealing the card"
    );
    assert_eq!(
        david.tryal_cards_remaining(),
        5,
        "Expected 5 cards before revealing the card"
    );

    let game = game.kill_players(vec![bob, david]);

    let bob = game
        .get_player_by_position(1)
        .expect("Expected player to be found");

    let david = game
        .get_player_by_position(3)
        .expect("Expected player to be found");

    assert_eq!(
        game.players_still_alive().len(),
        2,
        "Expected 2 alive players"
    );
    assert_eq!(
        bob.tryal_cards_remaining(),
        0,
        "Expected 0 cards after revealing the card"
    );
    assert_eq!(
        david.tryal_cards_remaining(),
        0,
        "Expected 0 cards after revealing the card"
    );
}
