
document.getElementById('create-new-character').addEventListener('click', function () {
    document.getElementById('character-incubator-wizard').showModal();
});


document.getElementById('dialog-exit').addEventListener('click', function () {
    document.getElementById('character-incubator-wizard').close();
});


document.getElementById('dialog-next').addEventListener('click', function () {
    applyAncestry();
    console.log(character);
    refreshCharacterSheet();
    document.getElementById('character-incubator-wizard').close();
});

let ancestry = document.getElementById('ancestry')
ancestry.addEventListener('change', function () {
    displayAncestryBenefits(ancestry)
});


function applyAncestry() {
    const ancestry = document.getElementById('ancestry').value
    character.ancestry = titleCase(ancestry)
    const ancestryBenefits = benefitsByAncestry[ancestry]
    for (const benefits of ancestryBenefits.benefits) {
        if ("mech" in benefits) {
            interpret(benefits.mech, benefits)
        }
    }
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}


function interpret(dslString, context) {
    const statements = dslString.split(";")
    for (const statement of statements) {
        dsl = statement.trim().split(" ")
        const verb = dsl[0]
        let attribute
        let value
        switch (verb) {
            case "increase":
                attribute = dsl[1]
                value = parseInt(dsl[2])
                character[attribute] += value
                break;
            case "addAncFeature":
                character.ancestryFeatures.push(context)
                break;
            case "set":
                attribute = dsl[1]
                value = dsl[2]
                character[attribute] = value
                break;
            case "add":
                let element = dsl[1]
                switch (element) {
                    case "edge":
                        let edge = dsl.slice(2).join(" ")
                        character.edges.push(edge)
                        break;
                    case "inmunity":
                        let inmunity = dsl.slice(2).join(" ")
                        character.inmunities.push(inmunity)
                        break;
                    case "weakness":
                        let weakness = dsl.slice(2).join(" ")
                        character.weaknesses.push(weakness)
                        break;
                    case "manouver":
                        let manouver = dsl.slice(2).join(" ").split(":")
                        let manouverName = manouver[0]
                        let manouverDescription = manouver[1]
                        character.manouvers.push({ "name": manouverName, "description": manouverDescription, "origin": ancestry })
                        break;
                    case "ability":
                        character.abilities.push(abilities[dsl[2]])
                        break;
                }
                break;
        }
    }
}

function refreshCharacterSheet() {
    for (const attrName of directAttributes) {
        element = document.querySelectorAll(`[data-id='${attrName}']`)
        if (element.length > 0) {
            element[0].innerHTML = character[attrName]
        }
    }
}


function displayAncestryBenefits(ancestry) {
    const ancestryName = ancestry.value
    const ancestryBenefits = benefitsByAncestry[ancestryName]
    let list = document.getElementById('benefits-list')
    list.innerHTML = ""
    if (document.getElementById('extra-ancestry-features') != null) {
        document.getElementById('extra-ancestry-features').remove()
    }
    for (const benefits of ancestryBenefits.benefits) {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(benefits["short"]));
        list.appendChild(li);
    }

    if (ancestryName === "devil") {
        // add div after the list
        document.getElementById('benefits-list').insertAdjacentHTML('afterend', '<div id="extra-ancestry-features"></div>');
        // create a checkbox with the options
        const devilFeatures = document.getElementById('extra-ancestry-features')
        devilFeatures.innerHTML = ""
        for (const feature of ancestryBenefits.options.choices) {
            const div = document.createElement("div");
            div.innerHTML = `<input type="checkbox" id="${feature.name}" name="${feature.name}" value="${feature.name}">
            <label for="${feature.name}">${feature.name} cost: ${feature.cost}</label>`
            devilFeatures.appendChild(div);
        }

    }
}

const character = {
    //directAttributes: {
    name: "",
    playerName: "",
    ancestry: "",
    // culture: {
    cultureName: "",
    cultureEnvironment: "",
    cultureOrganization: "",
    cultureUpbringing: "",

    careerName: "",
    careerTitle: "",
    class: "",
    complications: null,
    languages: [],
    level: 0,
    renow: 0,
    //primAttributes: {
    might: 0,
    agility: 0,
    reason: 0,
    intuition: 0,
    presence: 0,

    //secAttributes
    size: 0,
    weight: 0,
    reach: 0,
    speed: 0,
    stability: 0,

    recoveries: 0,
    stamina: 0,
    victories: 0,
    heroicResourceName: "",
    heroicResource: 0,
    // },
    kit: {
        name: "",
        description: "",
        weapons: "",
        armor: "",
        melee: [0, 0, 0],
        ranged: [0, 0, 0],
        magic: [0, 0, 0],
        signatureAbility: {
            name: "",
            description: "",
        },
    },
    ancestryFeatures: [],
    edges: [],
    manouvers: [],
    abilities: [],
    inmunities: [],
    weaknesses: [],
}

directAttributes = [
    "name",
    "playerName",
    "ancestry",
    // "// culture: {
    "cultureName",
    "cultureEnvironment",
    "cultureOrganization",
    "cultureUpbringing",
    "careerName",
    "careerTitle",
    "class",
    "level",
    "renow",
    //        "//primAttributes: {
    "might",
    "agility",
    "reason",
    "intuition",
    "presence",
    //secAttributes
    "size",
    "weight",
    "reach",
    "speed",
    "stability",
    "recoveries",
    "stamina",
    "victories",
    "heroicResourceName",
    "heroicResource",
]

const benefitsByAncestry = {
    "devil": {
        "mech": "",
        "benefits": [
            {
                "short": "Silver Tongue: Gain an edge sometimes on negociations",
                "name": "Silver Tongue",
                "description": "You can twist how your words are perceived to get a better read on people. You gain an edge when attempting to discover an NPC’s motivations and pitfalls during negotiations.",
                "mech": "addAncFeature"
            },
            {
                "short": "Fiendish Features: Choose some devil features",
                "name": "Fiendish Features",
                "description": "When you create a devil character, you have 3 fiend points, which you use to select a number of features"
            }
        ],
        "options": {
            "number of choices": 3,
            "choices": [
                {
                    "name": "Barbed Tail",
                    "description": "",
                    "cost": 1
                },
                {
                    "name": "Beast Legs",
                    "description": "",
                    "cost": 2
                },
                {
                    "name": "Exposed Skeleton",
                    "description": "",
                    "cost": 2
                },
                {
                    "name": "Glowing Eyes",
                    "description": "",
                    "cost": 1
                },
                {
                    "name": "Hellsight",
                    "description": "",
                    "cost": 1
                },
                {
                    "name": "Horns",
                    "description": "",
                    "cost": 1
                },
                {
                    "name": "Prehensile",
                    "description": "",
                    "cost": 2
                },
                {
                    "name": "Wings",
                    "description": "",
                    "cost": 2
                },
            ]
        }
    },
    "dragon knight": {
        "mech": "",
        "benefits": [
            {
                "short": "Wyrmplate: Inmunity 5 to one damage type",
                "name": "Wyrmplate",
                "description": "Your hardened scales grant you immunity 5 to one of the following damage types: cold, corruption, fire, lightning, or poison. You can change your damage immunity type while out of combat (no action required)."

            },
            {
                "short": "Knighthood: Choose a knighhood benefit.",
                "name": "Knighthood",
                "description": "The legacy of the Dragon Phalanx lives in you. Choose one of the following benefits"
            }
        ],
        "options": {
            "number of choices": 1,
            "choices": [
                {
                    "name": "Draconian Rush",
                    "description": "",
                    "cost": 1
                },
                {
                    "name": "Draconian Guard",
                    "description": "",
                    "cost": 1
                },
                {
                    "name": "Draconian Pride",
                    "description": "",
                    "cost": 1
                },
            ]
        }
    },
    "dwarf": {
        "benefits": [
            {
                "short": "Grounded: +1 stability",
                "name": "Grounded",
                "description": "Your heavy stone body and connection to the earth makes it difficult for others to move you. Your stability increases by 1.",
                "mech": "increase stability 1"

            },
            {
                "short": "Spark Off Your Skin: +6 stamina",
                "name": "Spark Off Your Skin",
                "description": "Your stone skin affords you potent protection. Your Stamina increases by 6 at 1st level, then increases by an additional 1 each time you gain a new level",
                "mech": "increase stamina 6"
            },
            {
                "short": "Runic Carving: Carve a rune in your skin",
                "name": "Runic Carving",
                "description": "You can carve a magic rune onto your skin. The rune you carve determines the benefit you receive. You can change or remove this rune with 10 minutes of work while not engaged in combat.\n• Detection: Pick a specific type of creature, such as “goblins” or “humans” or an object, such as “magic swords” or “potions.” Your rune glows softly when you are within 20 squares of a chosen creature or object, regardless of line of effect. You can change the type of creature as a maneuver." +
                    "• Light: Your skin sheds light for 10 squares. " +
                    "You can turn this on and off as a maneuver." +
                    "• Voice: As a maneuver, you can communicate telepathically with another willing creature you have met before whose name you name, who can speak and understand a language you know, and is within 1 mile of you. You and the creature can respond to one another as if having a normal conversation. You can change the person you communicate with by changing the rune."
                , "mech": "addAncFeature"
            }
        ]
    },
    "wode elf": {
        "mech": "",
        "benefits": [
            {
                "mech": "add edge resistance rolls;add edge lore skills you have",
                "short": "Otherworldly Grace: Gain an edge on resistance rolls and lore skills you have.",
                "name": "Otherworldly Grace",
                "description": "Your elven body and mind can’t be contained for long, and accessing memories is as easy as living in the present for you. You gain an edge on resistance rolls, and on tests that use any skills you have from the lore skill group"

            },
            {
                "mech": "add edge agility test to hide and sneak;addAncFeature",
                "short": "Wode Elf Glamor: You are better at hiding and sneaking",
                "name": "Wode Elf Glamor",
                "description": "You can magically alter your appearance to better blend in with your surroundings. You gain an edge on Agility tests made to hide and sneak, and tests made to find you while you are hidden take a bane."
            },
            {
                "mech": "set speed 6",
                "short": "Swift: your speed is 6.",
                "name": "Swift",
                "description": "your speed is 6."
            }
        ]
    },
    "high elf": {
        "benefits": [
            {
                "mech": "add edge presence tests using the flirt or persuade skills;addAncFeature",
                "short": "High Elf Glamor: You are better at impressing people",
                "name": "High Elf Glamor",
                "description": "A magic glamor makes others perceive you as interesting and engaging, granting you an edge on Presence tests using the Flirt or Persuade skills. This glamor makes you look and sound slightly different to each creature you meet, since what is engaging to one might be different for another. However, you never appear to be anyone other than yourself."

            },
            {
                "mech": "add edge resistance rolls;add edge lore skills you have",
                "short": "Otherworldly Grace: Gain an edge on resistance rolls and lore skills you have",
                "name": "Otherworldly Grace",
                "description": "Your elven body and mind can’t be contained for long, and accessing memories is as easy as living in the present for you. You gain an edge on resistance rolls, and on tests that use any skills you have from the lore skill group"
            },
            {
                "mech": "addAncFeature",
                "short": "Unstopable Mind: You can't be dazed",
                "name": "Unstopable Mind",
                "description": "Your mind allows you to maintain your cool in any situation. You can’t be dazed."
            }
        ]
    },
    "hakaan": {
        "benefits": [
            {
                "mech": "addAncFeature",
                "short": "Undaunted: You can't die until it is your time, you just collapse",
                "name": "Undaunted",
                "description": "You can’t be weakened. Additionally, when your Stamina equals the negative of your winded value, you turn to rubble instead of dying. You are unaware of your surroundings in this state. After 12 hours, you regain Stamina equal to your recovery value"
            },
            {
                "mech": "addAncFeature",
                "short": "Doomsight: You get way better when it is your time to die, but then you die",
                "name": "Doomsight",
                "description": "While doomed, you lose the Undaunted benefit from this ancestry, you automatically get tier 3 results on tests and resistance rolls, and you don’t die no matter how low your Stamina falls. You then die immediately at the end of the encounter.If you don’t predetermine your death encounter, you can choose to become doomed while you are dying with the director’s approval (no action required)."

            },
            {
                "mech": "addAncFeature",
                "short": "Hakaan Might: You move things 1 square further",
                "name": "Hakaan Might",
                "description": "When you force move a creature or object, you can increase the distance moved by 1"
            },

        ]
    },
    "human": {
        "benefits": [
            {
                "mech": "add manouver Detect the Supernatural:Until the end of your next turn, you know the location of any supernatural object, Undead, Construct, or Creature from another plane of existence within 5 squares of you, even if you don't have line of effect on them.",
                "short": "Detect the Supernatural: You can detect supernatural things",
                "name": "Detect the Supernatural",
                "description": "As a Maneuver, until the end of your next turn, you know the location of any supernatural object, Undead, Construct, or Creature from another plane of existence within 5 squares of you, even if you don't have line of effect on them."

            },
            {
                "mech": "add inmunity Magic 2;add inmunity Psionic 2",
                "short": "Resist the Supernatural: Magic inmunity 2, Psionic inmunity 2",
                "name": "Resist the Supernatural",
                "description": "You have Magic Immunity 2 and Psionic Immunity 2. Each of theses immunities increases by 1 each time you level up."
            },
            {
                "mech": "increase recoveries 2",
                "short": "Staying Power: +2 recoveries",
                "name": "Staying Power",
                "description": "Increases your number of Recoveries by 2."
            }
        ]
    },
    "memonek": {
        "benefits": [
            {
                "mech": "addAncFeature;set speed 7;increase stability -2",
                "short": "Lightweight: Speed 7, fall 2 squares less, -2 stability",
                "name": "Lightweight",
                "description": "Your silicone body is aerodynamic and low in density. Your speed is 7 and whenever you fall, you reduce the distance of the fall by 2 squares. Additionally, your stability decreases by 2 to a minimum of 0. When you are force moved, you are force moved an additional 2 squares."

            },
            {
                "mech": "addAncFeature",
                "short": "Keeper of Order: Remove banes and edges from power rolls",
                "name": "Keeper of Order",
                "description": "When you or a creature adjacent to you makes a power roll, you can remove an edge or a bane on the roll as a free triggered action. You can only use this Benefit once per round."
            }
        ]
    },
    "orc": {
        "benefits": [
            {
                "mech": "addAncFeature",
                "short": "Bloodfire Rush: +2 speed when taking damage",
                "name": "Bloodfire Rush",
                "description": "When you take damage, your speed increases by 2 until the end of your next turn. You can Benefit from this feature only once per round."

            },
            {
                "mech": "addAncFeature",
                "short": "Relentless: Retaliate when dying",
                "name": "Relentless",
                "description": "When a creature deals damage to you that leaves you dying, you can make a free strike against any creature. If the creature is reduced to 0 Stamina by your attack, you can spend a Recovery."
            }
        ]
    },
    "polder": {
        "mech": "",
        "benefits": [
            {
                "mech": "set size 1",
                "short": "Short: Size 1",
                "name": "Short",
                "description": "Your size is 1s."

            },
            {
                "mech": "addAncFeature",
                "short": "Polder Geist: When starting from hidden, +3 speed",
                "name": "Polder Geist",
                "description": "When you start your turn while no creatures have line of effect to you, or while you are hidden from or have concealment from all creatures with line of effect to you, your speed is increased by 3 until the end of your turn."
            },
            {
                "mech": "add ability shadowmeld",
                "short": "Shadowmeld: You gain the Shadowmeld ability",
                "name": "Shadowmeld",
                "description": "You gain the Shadowmeld ability."
            }
        ]
    },
    "revenant": {
        "benefits": [
            {
                "mech": "addAncFeature",
                "short": "Former Life: Choose your former ancestry",
                "name": "Former Life",
                "description": "Choose the ancestry you were before you died. Your size equals that ancestry’s size. Your speed is 5. You lose all other ancestral Benefits from your original ancestry."

            },
            {
                "mech": "add edge Reason, Intuition, and Presence tests made to interact with undead",
                "short": "Undead Influence: You gain an edge when interacting with undead",
                "name": "Undead Influence",
                "description": "Your supernatural gifts allow you to influence other undead. You gain an edge on Reason, Intuition, and Presence tests made to interact with undead creatures"
            },
            {
                "mech": "add manouver Vengence Mark:you place a magic sigil on a creature within 10 squares of you. When you place a sigil, you can decide where it appears on the creature’s body, and whether the sigil is visible to only you or to all creatures. You always know the direction to the exact location of a creature who bears one of your sigils and is on the same plane of existence as you.",
                "short": "Vengeance Mark: You can mark a creature and to hunt them and make the mark explode",
                "name": "Vengence Mark",
                "description": "As a Maneuver, you place a magic sigil on a creature within 10 squares of you. When you place a sigil, you can decide where it appears on the creature’s body, and whether the sigil is visible to only you or to all creatures. You always know the direction to the exact location of a creature who bears one of your sigils and is on the same plane of existence as you."
            },
            {
                "mech": "addAncFeature;add inmunity cold 1;add inmunity corruption 1;add inmunity lightning 1;add inmunity poison 1;add weakness fire 5",
                "short": "Tough But Withered: You are overall resistant to the elements and tougher to kill. Fire weakness 5",
                "name": "Tough But Withered",
                "description": "Your undead body grants you cold, corruption, lightning immunity, and poison immunity equal to your level. You also have fire weakness 5. You can’t suffocate, and you don’t need to eat or drink to stay alive. Additionally, when your Stamina equals the negative of your winded value, you become inert instead of dying. You can continue to observe your surroundings, but you can’t speak, take actions, maneuvers, or triggered actions, or move and you fall prone. If you take any fire damage while in this state, your body is destroyed and you die. Otherwise, after 12 hours, you regain Stamina equal to your recovery value."
            }
        ]
    },
    "time Raider": {
        "mech": "",
        "benefits": [
            {
                "mech": "addAncFeature",
                "short": "Foresight: Your senses allow you to detect hidden creatures and impose banes on attacks against you",
                "name": "Foresight",
                "description": "Your senses extend past mundane obscuration and the veil of the future alike. You instinctively know the location of any concealed creatures who aren’t hidden from you, negating the usual bane on attacks against them. Additionally, whenever you are attacked, you can use a triggered action to impose a bane on the power roll."

            },
            {
                "mech": "addAncFeature",
                "short": "Four Arms: You can target two different creatures when grabbing and knocking back",
                "name": "Four Arms",
                "description": "Your multiple arms let you take on multiple tasks at the same time. Whenever you use the Grab or Knockback maneuver against an adjacent creature, you can target an additional adjacent creature, using the same power roll for both targets. You can grab up to two creatures at a time"
            },
            {
                "mech": "add inmunity psionic 5",
                "short": "Psionic Gift: Psionic immunity 5",
                "name": "Psionic Gift",
                "description": "Your mind is a formidable layer of defense, granting you psionic immunity 5."
            }
        ]
    }
}

const abilities = {
    "shadowmeld": {
        "flavour": "You become an actual shadow",
        "keywords": ["magic"],
        "distance": "self",
        "target": "self",
        "effect": "You flatten yourself into a shadow against a wall or floor you are touching, and become hidden from any creature you have cover or concealment from or who isn’t observing you. While in shadow form, you have full awareness of your surroundings, attacks against you and tests made to find you take a bane, and you can’t move or take actions or maneuvers except to exit this form. Any ability or effect that targets more than 1 square affects you in this form only if it explicitly affects the surface you are flattened against. You can exit this form as a maneuver."
    }
}
