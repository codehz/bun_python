import * as np from 'python:numpy';
import * as plt from 'python:matplotlib.pyplot';

const xpoints = np.array([1, 8]);
const ypoints = np.array([3, 10]);

plt.plot(xpoints, ypoints);
plt.show();