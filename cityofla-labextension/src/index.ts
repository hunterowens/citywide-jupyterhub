import {
  IRouter,
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import {ICommandPalette, MainAreaWidget} from '@jupyterlab/apputils';

import {IMainMenu} from '@jupyterlab/mainmenu';

import {IRenderMimeRegistry} from '@jupyterlab/rendermime';

import '../style/index.css';

const SOURCE = require('../welcome.md').default;

/**
 * Initialization data for the cityofla-labextension extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'cityofla-labextension',
  autoStart: true,
  requires: [ICommandPalette, IMainMenu, IRenderMimeRegistry, IRouter],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    menu: IMainMenu,
    rendermime: IRenderMimeRegistry,
    router: IRouter,
  ) => {
    const { commands, shell } = app;

    // Add a help link for the best practices site.
    menu.helpMenu.addGroup(
      [
        {
          command: 'help:open',
          args: {
            text: 'City of LA Best Practices',
            url: 'https://cityoflosangeles.github.io/best-practices',
          },
        },
      ],
      1,
    );

    // Function to create the welcome page.
    // This is deliberately not restored, as
    // we only want to show it when directed
    // by the URL router.
    const createWidget = () => {
      const content = rendermime.createRenderer('text/markdown');
      const model = rendermime.createModel({
        data: {'text/markdown': SOURCE},
      });
      void content.renderModel(model);
      content.addClass('jp-FAQ-content');
      const widget = new MainAreaWidget({content});
      widget.addClass('jp-FAQ');
      widget.title.label = 'Welcome';
      return widget;
    };

    let widget: MainAreaWidget;

    const command = 'cityoflosangeles:welcome';
    commands.addCommand(command, {
      label: 'Open Los Angeles Welcome Page',
      execute: () => {
        if (!widget || widget.isDisposed) {
          widget = createWidget();
        }
        shell.add(widget, 'main');
      },
    });

    // Add a command palette item for showing the welcome page.
    palette.addItem({command, category: 'Help'});

    // Allow the welcome page to be triggered via a query parameter.
    router.register({
      command,
      pattern: /(\?welcome|\&welcome)($|&)/,
    });
  },
};

export default extension;
