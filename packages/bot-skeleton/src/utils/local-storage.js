import LZString from 'lz-string';
import localForage from 'localforage';
import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

// Import your hardcoded XML files
import bot1 from './bots/Auto_robot_by_GLE1.xml';
import bot2 from './bots/Over_under_bot_by_GLE.xml';
import bot3 from './bots/STAKELIST_BOT_Even_&_Odd.xml';
import bot4 from './bots/Under_7_Derived_with_MT.xml';

const HARDCODED_BOTS = {
    Auto_robot_by_GLE1: bot1,
    Over_under_bot_by_GLE: bot2,
    STAKELIST_BOT_Even_Odd: bot3,
    Under_7_Derived_with_MT: bot4,
};

/**
 * Save workspace to localStorage
 * @param {String} save_type // constants/save_types.js (unsaved, local, googledrive)
 * @param {String} bot_name // Name of the bot to load from hardcoded files
 */
export const saveWorkspaceToRecent = async (bot_name, save_type = save_types.UNSAVED) => {
    // Get the XML content from your hardcoded bots
    const xml_content = HARDCODED_BOTS[bot_name];
    if (!xml_content) {
        console.error(`Bot ${bot_name} not found in hardcoded bots`);
        return;
    }

    // Parse the XML string to DOM
    const xml_dom = Blockly.Xml.textToDom(xml_content);
    const converted_xml_dom = convertStrategyToIsDbot(xml_dom);

    const {
        load_modal: { updateListStrategies },
        save_modal,
    } = DBotStore.instance;

    const workspace_id = Blockly.derivWorkspace.current_strategy_id || Blockly.utils.idGenerator.genUid();
    const workspaces = await getSavedWorkspaces();
    const current_xml = Blockly.Xml.domToText(converted_xml_dom);
    const current_timestamp = Date.now();
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === workspace_id);

    if (current_workspace_index >= 0) {
        const current_workspace = workspaces[current_workspace_index];
        current_workspace.xml = current_xml;
        current_workspace.name = bot_name; // Use the bot name directly
        current_workspace.timestamp = current_timestamp;
        current_workspace.save_type = save_type;
    } else {
        workspaces.push({
            id: workspace_id,
            timestamp: current_timestamp,
            name: bot_name, // Use the bot name directly
            xml: current_xml,
            save_type,
        });
    }

    workspaces
        .sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
        })
        .reverse();

    if (workspaces.length > 10) {
        workspaces.pop();
    }
    updateListStrategies(workspaces);
    localForage.setItem('saved_workspaces', LZString.compress(JSON.stringify(workspaces)));
};

// Rest of the functions remain the same...
export const getSavedWorkspaces = async () => {
    try {
        return JSON.parse(LZString.decompress(await localForage.getItem('saved_workspaces'))) || [];
    } catch (e) {
        return [];
    }
};

export const removeExistingWorkspace = async workspace_id => {
    const workspaces = await getSavedWorkspaces();
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === workspace_id);

    if (current_workspace_index >= 0) {
        workspaces.splice(current_workspace_index, 1);
    }

    await localForage.setItem('saved_workspaces', LZString.compress(JSON.stringify(workspaces)));
};

export const convertStrategyToIsDbot = xml_dom => {
    if (!xml_dom) return;
    if (xml_dom.hasAttribute('collection') && xml_dom.getAttribute('collection') === 'true') {
        xml_dom.setAttribute('collection', 'true');
    }
    xml_dom.setAttribute('is_dbot', 'true');
    return xml_dom;
};

/**
 * Helper function to load a hardcoded bot
 * @param {String} bot_name - Name of the bot to load
 */
export const loadHardcodedBot = bot_name => {
    return HARDCODED_BOTS[bot_name];
};
