use std::iter;

#[derive(Debug)]
pub struct Game {
    players: Vec<Player>,
}

impl Game {
    pub fn new(number_of_players: u8) -> Result<Self, NewGameError> {
        let valid_number_of_players: NumberOfPlayers = number_of_players.try_into()?;

        Ok(Game {
            players: iter::repeat_n(
                Player::new(&valid_number_of_players),
                number_of_players.into(),
            )
            .collect(),
        })
    }

    pub fn players_still_alive(&self) -> Vec<&Player> {
        self.players
            .iter()
            .filter(|player| player.is_alive())
            .collect()
    }
}

#[derive(Clone, Debug)]
pub struct Player {
    tryal_card_amount: u8,
}

impl Player {
    pub fn new(number_of_players: &NumberOfPlayers) -> Self {
        Player {
            tryal_card_amount: match number_of_players {
                NumberOfPlayers::Four | NumberOfPlayers::Five | NumberOfPlayers::Six => 5,
                NumberOfPlayers::Seven | NumberOfPlayers::Eight | NumberOfPlayers::Nine => 4,
                NumberOfPlayers::Ten | NumberOfPlayers::Eleven | NumberOfPlayers::Twelve => 3,
            },
        }
    }

    pub fn tryal_cards_remaining(&self) -> u8 {
        self.tryal_card_amount
    }

    pub fn is_alive(&self) -> bool {
        self.tryal_card_amount > 0
    }
}

#[derive(Debug, PartialEq)]
pub enum NewGameError {
    TooFewPlayersError(u8),
    TooManyPlayersError(u8),
}

pub enum NumberOfPlayers {
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Eleven = 11,
    Twelve = 12,
}

impl TryFrom<u8> for NumberOfPlayers {
    type Error = NewGameError;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            u8::MIN..=3 => Err(NewGameError::TooFewPlayersError(value)),
            4 => Ok(NumberOfPlayers::Four),
            5 => Ok(NumberOfPlayers::Five),
            6 => Ok(NumberOfPlayers::Six),
            7 => Ok(NumberOfPlayers::Seven),
            8 => Ok(NumberOfPlayers::Eight),
            9 => Ok(NumberOfPlayers::Nine),
            10 => Ok(NumberOfPlayers::Ten),
            11 => Ok(NumberOfPlayers::Eleven),
            12 => Ok(NumberOfPlayers::Twelve),
            13..=u8::MAX => Err(NewGameError::TooManyPlayersError(value)),
        }
    }
}
