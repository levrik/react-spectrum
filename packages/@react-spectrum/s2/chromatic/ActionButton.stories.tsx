/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {ActionButton, Avatar, Text} from '../src';
import {Fonts, NotificationBadges, UnsafeClassName} from '../stories/ActionButton.stories';
import {generatePowerset} from '@react-spectrum/story-utils';
import type {Meta} from '@storybook/react';
import NewIcon from '../s2wf-icons/S2_Icon_New_20_N.svg';
import {shortName} from './utils';
import {StaticColorProvider} from '../stories/utils';
import {style} from '../style' with { type: 'macro' };

const meta: Meta<typeof ActionButton> = {
  component: ActionButton,
  parameters: {
    chromaticProvider: {disableAnimations: true}
  },
  title: 'S2 Chromatic/ActionButton'
};

export default meta;

let states = [
  {isQuiet: true},
  {isDisabled: true},
  {size: ['XS', 'S', 'M', 'L', 'XL']},
  {staticColor: ['black', 'white']}
];

let combinations = generatePowerset(states);

const Template = (args) => {
  let {children, ...otherArgs} = args;
  return (
    <div className={style({display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 250px))', gridAutoFlow: 'row', justifyItems: 'start', gap: 24, width: '100vw'})}>
      {combinations.map(c => {
        let fullComboName = Object.keys(c).map(k => `${k}: ${c[k]}`).join(' ');
        let key = Object.keys(c).map(k => shortName(k, c[k])).join(' ');
        if (!key) {
          key = 'default';
        }

        let button = <ActionButton key={key} data-testid={fullComboName} {...otherArgs} {...c}>{children ? children : key}</ActionButton>;
        if (c.staticColor != null) {
          return (
            <StaticColorProvider key={`static-${key}`} staticColor={c.staticColor}>
              {button}
            </StaticColorProvider>
          );
        }

        return button;
      })}
    </div>
  );
};

export const Default = {
  render: Template
};

export const WithIcon = {
  render: Template,
  args: {
    children: <><NewIcon /><Text>Press me</Text></>
  }
};

export const IconOnly = {
  render: Template,
  args: {
    children: <NewIcon />
  }
};

export const WithAvatar = {
  render: Template,
  args: {
    children: <><Avatar src="https://i.imgur.com/xIe7Wlb.png" /><Text>Press me</Text></>
  }
};

export const AvatarOnly = {
  render: Template,
  args: {
    children: <Avatar src="https://i.imgur.com/xIe7Wlb.png" />
  }
};

export {Fonts, UnsafeClassName, NotificationBadges};
