import { useLocation } from 'react-router-dom';

export default function useURLQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}
