import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the cityofla-labextension extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'cityofla-labextension',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension cityofla-labextension is activated!');
  }
};

export default extension;
