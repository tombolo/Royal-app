import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

// Helper: fetch XML from public folder
const fetchBotXml = async botName => {
    try {
        const response = await fetch(`/bots/${botName}.xml`);
        if (!response.ok) throw new Error(`Failed to load ${botName}`);
        return await response.text();
    } catch (error) {
        console.error(`Error loading ${botName}:`, error);
        return `<xml xmlns="https://developers.google.com/blockly/xml" is_dbot="true">
                  <!-- Error loading ${botName} -->
                </xml>`;
    }
};

// Load bot XMLs from public folder
export const getStaticBots = async () => {
    const [autoRobotXml, overUnderXml, stakelistXml, derivMtXml] = await Promise.all([
        fetchBotXml('Auto_robot_by_GLE1'),
        fetchBotXml('Over_under_bot_by_GLE'),
        fetchBotXml('STAKELIST_BOT_Even_&_Odd'),
        fetchBotXml('Under_7_Derived_with_MT'),
    ]);

    return [
        {
            id: 'auto_robot_by_GLE1',
            name: 'Auto robot by GLE1',
            xml: autoRobotXml,
            timestamp: Date.now(),
            save_type: save_types.LOCAL,
        },
        {
            id: 'over_under_bot_by_GLE',
            name: 'Over under bot by GLE',
            xml: overUnderXml,
            timestamp: Date.now(),
            save_type: save_types.LOCAL,
        },
        {
            id: 'STAKELIST_BOT_Even_&_Odd',
            name: 'STAKELIST_BOT_Even_&_Odd',
            xml: stakelistXml,
            timestamp: Date.now(),
            save_type: save_types.LOCAL,
        },
        {
            id: 'Under_7_Derived_with_MT',
            name: 'Under_7_Derived_with_MT',
            xml: derivMtXml,
            timestamp: Date.now(),
            save_type: save_types.LOCAL,
        },
    ];
};

// Save logic just updates the UI with current static list (no saving to storage)
export const saveWorkspaceToRecent = async (xml, save_type = save_types.UNSAVED) => {
    const xml_dom = convertStrategyToIsDbot(xml);
    xml_dom.setAttribute('is_dbot', true);

    const {
        load_modal: { updateListStrategies },
    } = DBotStore.instance;

    const staticBots = await getStaticBots();
    updateListStrategies(staticBots);
};

// Get saved strategies = return static bots only
export const getSavedWorkspaces = async () => {
    return await getStaticBots();
};

// Prevent deleting static bots
export const removeExistingWorkspace = async workspace_id => {
    console.warn(`Remove blocked for static bot: ${workspace_id}`);
    return false;
};

// Ensure xml has dbot flag
export const convertStrategyToIsDbot = xml_dom => {
    if (!xml_dom) return;
    if (xml_dom.hasAttribute('collection') && xml_dom.getAttribute('collection') === 'true') {
        xml_dom.setAttribute('collection', 'true');
    }
    xml_dom.setAttribute('is_dbot', 'true');
    return xml_dom;
};

// Load and inject a strategy into Blockly
export const loadStrategy = async strategy_id => {
    const workspaces = await getStaticBots();
    const strategy = workspaces.find(ws => ws.id === strategy_id);

    if (!strategy) return false;

    try {
        const parser = new DOMParser();
        const xmlDom = parser.parseFromString(strategy.xml, 'text/xml').documentElement;
        const convertedXml = convertStrategyToIsDbot(xmlDom);

        Blockly.Xml.domToWorkspace(convertedXml, Blockly.derivWorkspace);
        Blockly.derivWorkspace.current_strategy_id = strategy_id;
        return true;
    } catch (error) {
        console.error('Error loading strategy:', error);
        return false;
    }
};
