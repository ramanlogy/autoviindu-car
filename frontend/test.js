import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 50000, // virtual users
  duration: '30s',
};

export default function () {
  http.get('https://autoviindu.vercel.app');
  sleep(1);
}