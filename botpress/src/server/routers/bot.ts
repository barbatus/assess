import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = 'https://api.openbook.botpress.cloud/v1';

axios.defaults.paramsSerializer = {
  serialize: (params) => {
    return qs.stringify(params, { indices: false });
  },
};

axios.defaults.headers.common['Authorization'] =
  'bearer 0pC7pOtVweWHRBKGnQhuO-0ZKk2ECGwFQKMhHa-upH4.spOB9okvwVQ9_9CmERl_nqdCjFGvFUFl-HhUPxFLQ7E';

export const queryAnswer = async (artifactId: string, query: string) => {
  const { data } = await axios.post<{ result: { answer: string } }>(
    `artifacts/${artifactId}/query`,
    {
      query,
      history: [],
      answer_level: 'strict',
    },
  );
  return data.result.answer;
};
