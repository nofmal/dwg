import v from 'voca';

import Dwg from './algorithm';
import * as style from './views/style/main.scss';

style;
(document.getElementById('generator') as HTMLElement).classList.remove('no-display');

const site_input = document.getElementById('site') as HTMLInputElement;
const name_input = document.getElementById('name') as HTMLInputElement;
const password_input = document.getElementById('password') as HTMLInputElement;
const show_password_button = document.getElementById('show-password') as HTMLButtonElement;
const length_input = document.getElementById('length') as HTMLInputElement;
const counter_input = document.getElementById('counter') as HTMLInputElement;
const generate_button = document.getElementById('generate-button') as HTMLButtonElement;
const result_div = document.getElementById('result-popup') as HTMLDivElement;
const result_input = document.getElementById('result') as HTMLInputElement;
const copy_to_clipboard_button = document.getElementById('copy-to-clipboard') as HTMLButtonElement;
const show_diceware_button = document.getElementById('show-diceware') as HTMLButtonElement;

function checkString(element: HTMLInputElement) {
  if (!element.value.length) {
    throw new Error(`${element.id}'s value cannot be empty!`);
  } else if (v.startsWith(element.value, ' ')) {
    throw new Error(`${element.id}'s value contains invalid values!`);
  }
}

const dwg_error = {
  error_div: document.getElementById('error-popup') as HTMLDivElement,
  error_span: document.getElementById('error-message') as HTMLSpanElement,

  show: function(message: string) {
    this.error_span.innerText = message;
    this.error_div.classList.remove('no-display');
  },

  hide: function() {
    this.error_div.classList.add('no-display');
  },
};

const progress_bar = {
  div: document.getElementById('generator-progress') as HTMLProgressElement,

  set: function(value: number) {
    this.div.value = value;
    this.div.innerText = ` ${value}% `;
  },

  reset: function() {
    this.set(0);
  },
}

function toggleInputType(italic: Element, element: HTMLInputElement) {
  if (element.type[0] === 't') {
    element.type = 'password';
    italic.className = 'eye';
  } else {
    element.type = 'text';
    italic.className = 'eye-slash';
  }
}

show_password_button.onclick = function(_event: MouseEvent) {
  toggleInputType(show_password_button.firstElementChild!, password_input);
};

show_diceware_button.onclick = function(_event: MouseEvent) {
  toggleInputType(show_diceware_button.firstElementChild!, result_input);
};

copy_to_clipboard_button.onclick = function(_event: MouseEvent) {
  if (result_input.value.length > 0) {
    copy_to_clipboard_button.disabled = true;
    navigator.clipboard.writeText(result_input.value).finally(function() {
      copy_to_clipboard_button.disabled = false;
    });
  }
};

function checkInput(element: HTMLInputElement): number {
  const parsed = Number.parseInt(element.value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${element.id}'s value is not a valid number!`);
  }

  const min_parsed = Number.parseInt(element.min);
  const max_parsed = Number.parseInt(element.max);
  if (parsed < min_parsed) {
    element.value = element.min;
    throw new Error(`${element.id}'s value cannot be less than ${element.min}!`);
  } else if (parsed > max_parsed) {
    element.value = element.max;
    throw new Error(`${element.id}'s value cannot be more than ${element.max}!`);
  }

  return parsed;
}

generate_button.onclick = function(_event: MouseEvent) {
  dwg_error.hide();
  progress_bar.reset();
  result_div.classList.add('no-display');
  generate_button.disabled = true;
  result_input.value = '';

  let length: number;
  let counter: number;

  try {
    checkString(site_input);
    checkString(name_input);
    checkString(password_input);
    length = checkInput(length_input);
    counter = checkInput(counter_input);
  } catch (err) {
    dwg_error.show((err as Error).message);
    generate_button.disabled = false;
    return;
  }

  if (v.countGraphemes(password_input.value) <= 4) {
    dwg_error.show('Password must be longer than 4 characters!');
    generate_button.disabled = false;
    return;
  }

  progress_bar.set(17);
  const dwg = new Dwg(name_input.value, site_input.value, counter, length);
  progress_bar.set(33);
  const salt = dwg.salt();
  progress_bar.set(50);

  dwg.key(salt, password_input.value).then(function(value: Uint8Array) {
    progress_bar.set(67)
    const seed = dwg.seed(value);
    progress_bar.set(83);
    const result_diceware = dwg.generate(seed);
    progress_bar.set(100);

    result_input.value = result_diceware;
    result_div.classList.remove('no-display');
  }).catch(function(reason: Error) {
    dwg_error.show(reason.message);
  }).finally(function() {
    generate_button.disabled = false;
  });
}


