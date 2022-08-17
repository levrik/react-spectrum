import {AriaComboBoxProps} from '@react-types/combobox';
import {ButtonContext} from './Button';
import {InputContext} from './Input';
import {LabelContext} from './Label';
import {ListBoxContext, ListBoxProps} from './ListBox';
import {PopoverContext} from './Popover';
import {Provider, slotCallbackSymbol, useSlot} from './utils';
import React, {ReactNode, useCallback, useRef, useState} from 'react';
import {useCollection} from './Collection';
import {useComboBox, useFilter} from 'react-aria';
import {useComboBoxState} from 'react-stately';
import {useResizeObserver} from '@react-aria/utils';

interface ComboBoxProps<T extends object> extends Omit<AriaComboBoxProps<T>, 'children' | 'placeholder' | 'name' | 'label'> {
  children: ReactNode
}

export function ComboBox<T extends object>(props: ComboBoxProps<T>) {
  let [propsFromListBox, setListBoxProps] = useState<ListBoxProps<T>>({children: []});

  let {contains} = useFilter({sensitivity: 'base'});
  let {portal, collection} = useCollection({
    items: props.items ?? props.defaultItems ?? propsFromListBox.items,
    children: propsFromListBox.children
  });
  let state = useComboBoxState({
    defaultFilter: contains,
    ...props,
    items: propsFromListBox ? (props.items ?? propsFromListBox.items) : [],
    children: null,
    collection
  });

  let buttonRef = useRef<HTMLButtonElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);
  let listBoxRef = useRef(null);
  let popoverRef = useRef(null);
  let [labelRef, label] = useSlot();
  let {
    buttonProps,
    inputProps,
    listBoxProps,
    labelProps
  } = useComboBox({
    ...props,
    label,
    inputRef,
    buttonRef,
    listBoxRef,
    popoverRef
  },
  state);

  // Make menu width match input + button
  // TODO: should this be optional?
  let [menuWidth, setMenuWidth] = useState(null);
  let onResize = useCallback(() => {
    if (buttonRef.current && inputRef.current) {
      let buttonRect = buttonRef.current.getBoundingClientRect();
      let inputRect = inputRef.current.getBoundingClientRect();
      let minX = Math.min(buttonRect.left, inputRect.left);
      let maxX = Math.max(buttonRect.right, inputRect.right);
      setMenuWidth(maxX - minX);
    }
  }, [buttonRef, inputRef, setMenuWidth]);

  useResizeObserver({
    ref: inputRef,
    onResize: onResize
  });

  return (
    <Provider
      values={[
        [LabelContext, {...labelProps, ref: labelRef}],
        [ButtonContext, {...buttonProps, ref: buttonRef}],
        [InputContext, {...inputProps, ref: inputRef}],
        [PopoverContext, {state, ref: popoverRef, triggerRef: inputRef, placement: 'bottom start', preserveChildren: true, isNonModal: true, style: {width: menuWidth}}],
        [ListBoxContext, {state, [slotCallbackSymbol]: setListBoxProps, ...listBoxProps, ref: listBoxRef}]
      ]}>
      {props.children}
      {portal}
    </Provider>
  );
}