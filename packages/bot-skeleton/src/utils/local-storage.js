import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

// Import XML files as raw text

import overUnderXml from './bots/binary_smasher.xml?raw';
import nilotemine from './bots/nilote_mine.xml?raw';

// Load bot XMLs from imported files
export const getStaticBots = async () => {
    return [
        
        {
            id: 'binary_smasher',
            name: 'binary_smasher',
            xml: overUnderXml,
            timestamp: Date.now(),
            save_type: save_types.LOCAL,
        },
        {
            id: 'nilote_mine',
            name: 'nilote_mine',
            xml: nilotemine,
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
