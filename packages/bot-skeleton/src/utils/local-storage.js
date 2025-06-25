import AutoRobot from './bots/Auto_robot_by_GLE1.xml';
import OverUnderBot from './bots/Over_under_bot_by_GLE.xml';
import StakelistBot from './bots/STAKELIST_BOT_Even_&_Odd.xml';
import DerivMt from './bots/Under_7_Derived_with_MT.xml';

// Static bot configurations - these cannot be modified or deleted
const STATIC_BOTS = [
    {
        id: 'auto_robot_by_GLE1',
        name: 'Auto robot by GLE1',
        xml: AutoRobot,
        timestamp: Date.parse('2023-01-01'), // Fixed timestamp for static bots
        save_type: 'static', // Special type for static bots
    },
    {
        id: 'over_under_bot_by_GLE',
        name: 'Over under bot by GLE',
        xml: OverUnderBot,
        timestamp: Date.parse('2023-01-02'),
        save_type: 'static',
    },
    {
        id: 'STAKELIST_BOT_Even_&_Odd',
        name: 'STAKELIST BOT Even & Odd',
        xml: StakelistBot,
        timestamp: Date.parse('2023-01-03'),
        save_type: 'static',
    },
    {
        id: 'Under_7_Derived_with_MT',
        name: 'Under 7 Derived with MT',
        xml: DerivMt,
        timestamp: Date.parse('2023-01-04'),
        save_type: 'static',
    },
];

/**
 * Get only the static bots - no saved workspaces will be returned
 */
export const getStaticBots = () => {
    return [...STATIC_BOTS]; // Return a copy to prevent modification
};

/**
 * Load a static bot by ID
 * @param {string} strategy_id - The ID of the bot to load
 * @returns {boolean} True if loaded successfully, false otherwise
 */
export const loadStrategy = async strategy_id => {
    const bot = STATIC_BOTS.find(bot => bot.id === strategy_id);

    if (!bot) {
        console.error(`Static bot with ID ${strategy_id} not found`);
        return false;
    }

    try {
        // Parse the XML string to DOM
        const xmlDom = Blockly.Xml.textToDom(bot.xml);
        if (!xmlDom) {
            throw new Error('Failed to parse XML content');
        }

        // Convert and load to workspace
        const convertedXml = convertStrategyToIsDbot(xmlDom);
        Blockly.Xml.domToWorkspace(convertedXml, Blockly.derivWorkspace);
        Blockly.derivWorkspace.current_strategy_id = strategy_id;

        return true;
    } catch (error) {
        console.error('Error loading static bot:', error);
        return false;
    }
};

/**
 * Convert strategy XML to include DBot-specific attributes
 */
export const convertStrategyToIsDbot = xml_dom => {
    if (!xml_dom) return null;

    // Clone the DOM to avoid modifying the original
    const clonedDom = xml_dom.cloneNode(true);

    if (clonedDom.hasAttribute('collection') && clonedDom.getAttribute('collection') === 'true') {
        clonedDom.setAttribute('collection', 'true');
    }
    clonedDom.setAttribute('is_dbot', 'true');

    return clonedDom;
};

// Remove all saving-related functionality since we only want static bots
export const saveWorkspaceToRecent = () => {
    console.warn('Saving functionality is disabled for static bots');
    return Promise.resolve();
};

export const removeExistingWorkspace = () => {
    console.warn('Deletion functionality is disabled for static bots');
    return Promise.resolve(false);
};

// Simplified interface
export default {
    getStaticBots,
    loadStrategy,
    convertStrategyToIsDbot,
};
