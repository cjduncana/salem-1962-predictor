#[derive(Debug)]
pub struct Game {
    players: Vec<Player>,
}

impl Game {
    pub fn new(number_of_players: u8) -> Result<Self, NewGameError> {
        let valid_number_of_players: NumberOfPlayers = number_of_players.try_into()?;

        Ok(Game {
            players: (0..number_of_players)
                .map(|position| Player::new(position.to_string(), &valid_number_of_players))
                .collect(),
        })
    }

    pub fn players_still_alive(&self) -> Vec<&Player> {
        self.players
            .iter()
            .filter(|player| player.is_alive())
            .collect()
    }

    pub fn get_player_by_position(&self, position: usize) -> Option<&Player> {
        self.players.get(position)
    }

    pub fn reveal_tryal_card(&self, player: &Player, card_type: &CardType) -> Game {
        Game {
            players: self
                .players
                .iter()
                .map(|p| {
                    if p == player {
                        p.reveal_tryal_card(card_type)
                    } else {
                        p.clone()
                    }
                })
                .collect(),
        }
    }
}

pub enum CardType {
    NotAWitch,
    Witch,
}

#[derive(Clone, Debug)]
pub struct Player {
    id: String,
    tryal_card_amount: u8,
}

impl Player {
    pub fn new(id: String, number_of_players: &NumberOfPlayers) -> Self {
        Player {
            id,
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

    pub fn reveal_tryal_card(&self, card_type: &CardType) -> Self {
        Player {
            id: self.id.clone(),
            tryal_card_amount: match card_type {
                CardType::NotAWitch => self.tryal_card_amount - 1,
                CardType::Witch => 0,
            },
        }
    }
}

impl PartialEq for Player {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
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
